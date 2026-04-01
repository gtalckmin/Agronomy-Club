# Quiz-Mate Service Deployment Guide

## Overview

**Quiz-Mate** is a standalone quiz service designed to run on **Google Cloud Run** as a containerized application. It integrates with the Agronomy Club website via Firestore and provides:

- Quiz management (CRUD for curators)
- Quiz responses and scoring
- Question pool management
- Real-time quiz results
- RESTful API for the main website

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Agronomy Club Website (Next.js)                │
│  https://agronomy-club.web.app                  │
│  - Auth: Firebase Auth                          │
│  - Data: Firestore                              │
│  - APIs: /api/* (Cloud Functions)               │
└────────────────────┬────────────────────────────┘
                     │ (HTTP/REST)
                     ▼
┌─────────────────────────────────────────────────┐
│  Quiz-Mate Service (Cloud Run)                  │
│  https://quizmate-xxx.run.app                   │
│  - Language: Python/Node.js (choose one)        │
│  - Framework: Flask/Express                     │
│  - Database: Firestore (shared)                 │
│  - Auth: Firebase Service Account               │
└─────────────────────────────────────────────────┘
```

## Phase 3: Deployment Steps

### Step 1: Prepare the Service Code

#### Option A: Python with Flask

Create a new directory and service structure:

```bash
mkdir quiz-mate
cd quiz-mate
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install flask firebase-admin gunicorn
pip freeze > requirements.txt
```

Create `app.py`:

```python
from flask import Flask, jsonify, request
from firebase_admin import credentials, firestore, auth
import os
import json
from functools import wraps

app = Flask(__name__)

# Initialize Firebase Admin SDK
if not os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY'):
    raise ValueError("FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set")

creds_json = json.loads(os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY'))
cred = credentials.Certificate(creds_json)
app.firebase_app = __import__('firebase_admin').initialize_app(cred)

db = firestore.client()

def verify_token(f):
    """Decorator to verify Firebase ID token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Missing authorization token'}), 401
        
        try:
            decoded = auth.verify_id_token(token)
            request.user = decoded
        except Exception as e:
            return jsonify({'error': f'Invalid token: {str(e)}'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

# Health check
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

# Quiz endpoints
@app.route('/api/quizzes', methods=['GET'])
@verify_token
def list_quizzes():
    """List all available quizzes"""
    quizzes = db.collection('quizzes').stream()
    return jsonify([{
        'id': q.id,
        'title': q.get('title'),
        'description': q.get('description'),
        'createdAt': q.get('createdAt')
    } for q in quizzes]), 200

@app.route('/api/quizzes/<quiz_id>', methods=['GET'])
@verify_token
def get_quiz(quiz_id):
    """Get quiz and its questions"""
    quiz_doc = db.collection('quizzes').document(quiz_id).get()
    if not quiz_doc.exists:
        return jsonify({'error': 'Quiz not found'}), 404
    
    questions = db.collection('quizzes').document(quiz_id).collection('questions').stream()
    
    return jsonify({
        'id': quiz_doc.id,
        'title': quiz_doc.get('title'),
        'description': quiz_doc.get('description'),
        'questions': [{
            'id': q.id,
            'text': q.get('text'),
            'type': q.get('type'),  # 'multiple_choice', 'short_answer', 'true_false'
            'options': q.get('options', [])
        } for q in questions]
    }), 200

@app.route('/api/quizzes/<quiz_id>/submit', methods=['POST'])
@verify_token
def submit_quiz(quiz_id):
    """Submit quiz responses"""
    data = request.json
    user_id = request.user['uid']
    
    response_doc = {
        'userId': user_id,
        'quizId': quiz_id,
        'answers': data.get('answers', []),
        'submittedAt': firestore.SERVER_TIMESTAMP,
        'score': 0  # Calculate server-side
    }
    
    db.collection('quizzes').document(quiz_id).collection('responses').add(response_doc)
    
    return jsonify({'message': 'Quiz submitted successfully'}), 201

@app.route('/api/quizzes/<quiz_id>/responses', methods=['GET'])
@verify_token
def get_responses(quiz_id):
    """Get user's quiz responses (curators see all)"""
    user_id = request.user['uid']
    user_doc = db.collection('users').document(user_id).get()
    is_curator = user_doc.get('role') in ['curator', 'admin']
    
    query = db.collection('quizzes').document(quiz_id).collection('responses')
    
    if not is_curator:
        query = query.where('userId', '==', user_id)
    
    responses = query.stream()
    
    return jsonify([{
        'id': r.id,
        'userId': r.get('userId'),
        'score': r.get('score'),
        'submittedAt': r.get('submittedAt')
    } for r in responses]), 200

# Error handling
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
```

#### Option B: Node.js with Express

```bash
mkdir quiz-mate
cd quiz-mate
npm init -y
npm install express firebase-admin
```

Create `server.js`:

```javascript
const express = require('express');
const admin = require('firebase-admin');
const app = express();

app.use(express.json());

const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

const db = admin.firestore();
const auth = admin.auth();

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }
  
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/quizzes', verifyToken, async (req, res) => {
  const quizzesSnap = await db.collection('quizzes').get();
  const quizzes = quizzesSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  res.json(quizzes);
});

app.get('/api/quizzes/:quizId', verifyToken, async (req, res) => {
  const quizDoc = await db.collection('quizzes').doc(req.params.quizId).get();
  if (!quizDoc.exists) {
    return res.status(404).json({ error: 'Quiz not found' });
  }
  
  const questionsSnap = await db.collection('quizzes').doc(req.params.quizId).collection('questions').get();
  const questions = questionsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  res.json({
    id: quizDoc.id,
    ...quizDoc.data(),
    questions
  });
});

app.post('/api/quizzes/:quizId/submit', verifyToken, async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  const userId = req.user.uid;
  
  const response = {
    userId,
    quizId,
    answers,
    submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    score: 0
  };
  
  await db.collection('quizzes').doc(quizId).collection('responses').add(response);
  res.status(201).json({ message: 'Quiz submitted successfully' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Quiz-Mate service listening on port ${PORT}`);
});
```

### Step 2: Containerize the Service

Create `Dockerfile` in the quiz-mate directory:

```dockerfile
# Python version
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

ENV PORT=8080
EXPOSE 8080

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
```

Or for Node.js:

```dockerfile
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY server.js .

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
```

Create `.dockerignore`:

```
node_modules
npm-debug.log
*.pyc
__pycache__
venv
.git
.env
```

### Step 3: Build and Push to Google Container Registry

```bash
# Configure gcloud
gcloud config set project agronomy-club
gcloud auth configure-docker

# Build the image
docker build -t gcr.io/agronomy-club/quiz-mate:latest .

# Push to GCR
docker push gcr.io/agronomy-club/quiz-mate:latest
```

### Step 4: Deploy to Cloud Run

```bash
gcloud run deploy quiz-mate \
  --image gcr.io/agronomy-club/quiz-mate:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_SERVICE_ACCOUNT_KEY="$(cat ../agronomy-club-a0d902fdca21.json | jq -c .)" \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600 \
  --max-instances 10
```

The service will be available at:
```
https://quiz-mate-<hash>.run.app
```

### Step 5: Connect from Website

Update the Next.js environment variables (`.env.local`):

```
NEXT_PUBLIC_QUIZ_MATE_URL=https://quiz-mate-<hash>.run.app
```

Create an API proxy route in the website (`src/app/api/quiz/[...path]/route.ts`):

```typescript
import { getAuth } from 'firebase-admin/auth';
import { decodeAuth } from '@/lib/auth/decode';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const segment = '/' + path.join('/');

  const auth = await decodeAuth(request);
  if (!auth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(JSON.stringify({ error: 'No token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const quizMateUrl = process.env.NEXT_PUBLIC_QUIZ_MATE_URL;
  const response = await fetch(`${quizMateUrl}/api${segment}`, {
    method: request.method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: request.method !== 'GET' ? await request.text() : undefined
  });

  return new Response(response.body, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return GET(request, { params });
}
```

## Monitoring & Logging

View logs and metrics:

```bash
# View recent logs
gcloud run logs read quiz-mate --limit 20

# View continuous logs
gcloud run logs read quiz-mate --limit 50 --follow

# View metrics and performance
gcloud monitoring dashboards list
```

## Troubleshooting

### Service fails to start
- Check logs: `gcloud run logs read quiz-mate`
- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` env var is set correctly
- Ensure service account has Firestore permissions

### Slow response times
-Increase memory/CPU: Update Cloud Run deployment
- Add connection pooling to Firestore client
- Cache frequently accessed quizzes

### Authorization issues
- Verify Firebase token format (should be sent as `Authorization: Bearer <token>`)
- Check Firestore security rules for `/quizzes` collection

## Cost Considerations

**Cloud Run pricing** (free tier includes):
- 180,000 vCPU-seconds/month
- 360,000 GB-seconds/month
- For a low-traffic quiz service, cost is typically **$0-5/month**

**Optimization tips**:
- Use `--min-instances 0` to reduce idle costs
- Set `--max-instances` to prevent runaway costs
- Monitor invocation logs in Cloud Console

## Next Steps

1. Choose your tech stack (Python/Flask or Node.js/Express)
2. Develop and test locally: `python app.py` or `node server.js`
3. Build and push Docker image to GCR
4. Deploy to Cloud Run
5. Update website `.env.local` with service URL
6. Test integration with member portal

