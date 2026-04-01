# Quiz-Mate Deployment Guide for Agronomy Club

## Overview

**Quiz-Mate** is a lightweight, real-time quiz engine that will run as a standalone microservice on **Google Cloud Run**. It's already production-ready and includes:

- ✅ Interactive quiz hosting (real-time WebSocket)
- ✅ Built-in web interface (host + player views)
- ✅ Leaderboard & answer statistics
- ✅ QR code joining
- ✅ Timer and shuffle options
- ✅ Docker-ready deployment

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Agronomy Club Website (Next.js)                        │
│  https://agronomy-club.web.app                          │
│  - Quiz links in navigation                              │
│  - Embed or redirect to quiz-mate                        │
│  - Optional: API proxy for analytics                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS redirect or embed
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Quiz-Mate Service (Cloud Run)                          │
│  https://quiz-mate-xxx.run.app                          │
│  - Express.js + Socket.io backend                       │
│  - React frontend (built-in)                            │
│  - JSON-based quiz storage                              │
│  - Auto-scaling (0-10 instances)                        │
│  - No database required (in-memory)                     │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 3: Step-by-Step Deployment

### Step 1: Install Prerequisites

```bash
# Ensure you have gcloud CLI installed
which gcloud

# If not installed, install it:
# https://cloud.google.com/sdk/docs/install

# Ensure Docker is installed
which docker

# Configure gcloud
gcloud config set project agronomy-club
gcloud auth login
```

### Step 2: Test Locally

```bash
# Navigate to quiz-mate directory
cd ~/Documents/Agronomy-Club/quiz-mate

# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Build frontend
cd frontend && npm run build && cd ..

# Start the backend server
cd backend && npm start

# Access at http://localhost:8080
# Host: Create a quiz
# Players: Join with code
```

### Step 3: Build Docker Image

```bash
# Create Dockerfile (already included in repo)
# Quiz-Mate's Dockerfile automatically:
#   1. Installs frontend & backend dependencies
#   2. Builds the React frontend
#   3. Copies to dist/ directory
#   4. Exposes port 8080

# Build the image
cd ~/Documents/Agronomy-Club/quiz-mate

docker build -t gcr.io/agronomy-club/quiz-mate:latest .

# Test locally
docker run -p 8080:8080 gcr.io/agronomy-club/quiz-mate:latest

# Access at http://localhost:8080
```

### Step 4: Push to Google Container Registry

```bash
# Configure Docker to authenticate with GCR
gcloud auth configure-docker

# Push the image
docker push gcr.io/agronomy-club/quiz-mate:latest

# Verify image in GCR
gcloud container images list --project=agronomy-club
```

### Step 5: Deploy to Cloud Run

```bash
# Deploy service
gcloud run deploy quiz-mate \
  --image gcr.io/agronomy-club/quiz-mate:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600 \
  --max-instances 10 \
  --port 8080

# Get the service URL
gcloud run services describe quiz-mate --region us-central1

# Output will be like: https://quiz-mate-a1b2c3d4-uc.a.run.app
```

### Step 6: Use the Deployment Script

Alternatively, use the included bash script:

```bash
cd ~/Documents/Agronomy-Club/quiz-mate
chmod +x deploy-to-cloud-run.sh
./deploy-to-cloud-run.sh
```

---

## Integration with Website

### Option A: Direct Link (Recommended)

Add a "Quizzes" section to the Agronomy Club website:

```typescript
// src/app/quizzes/page.tsx
export default function QuizzesPage() {
  return (
    <div>
      <h1>Take a Quiz</h1>
      <p>Interactive quizzes with real-time scoring and leaderboards.</p>
      <a href={process.env.NEXT_PUBLIC_QUIZ_MATE_URL} target="_blank">
        Open Quiz-Mate →
      </a>
    </div>
  );
}
```

### Option B: Embed (Advanced)

Embed quiz-mate in an iframe:

```typescript
// src/components/QuizFrame.tsx
interface QuizFrameProps {
  quizCode?: string;
}

export function QuizFrame({ quizCode }: QuizFrameProps) {
  const quizMateUrl = process.env.NEXT_PUBLIC_QUIZ_MATE_URL || 'https://quiz-mate-xxx.run.app';
  const src = quizCode 
    ? `${quizMateUrl}?code=${quizCode}` 
    : quizMateUrl;

  return (
    <iframe
      src={src}
      width="100%"
      height="600"
      frameBorder="0"
      allow="camera; microphone"
    />
  );
}
```

### Option C: API Proxy (For Analytics)

Create an API route to proxy quiz-mate for potential future analytics:

```typescript
// src/app/api/quiz/[...path]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const segment = '/' + path.join('/');
  const quizMateUrl = process.env.QUIZ_MATE_INTERNAL_URL;

  const response = await fetch(`${quizMateUrl}${segment}`, {
    method: request.method,
    headers: request.headers
  });

  return response;
}
```

---

## Environment Configuration

### Website Environment Variables

Add to `.env.local`:

```bash
# Quiz-Mate Service
NEXT_PUBLIC_QUIZ_MATE_URL=https://quiz-mate-a1b2c3d4-uc.a.run.app
QUIZ_MATE_INTERNAL_URL=https://quiz-mate-a1b2c3d4-uc.a.run.app
```

### Cloud Run Environment Variables

Currently, quiz-mate doesn't require environment variables. Future enhancements might need:
- Database connection strings
- API keys for integrations
- Custom configuration

Add via:

```bash
gcloud run deploy quiz-mate \
  --image gcr.io/agronomy-club/quiz-mate:latest \
  --set-env-vars KEY1=value1,KEY2=value2
```

---

## Monitoring & Logs

### View Logs

```bash
# Recent logs
gcloud run logs read quiz-mate --limit 20

# Continuous logs (follow mode)
gcloud run logs read quiz-mate --limit 50 --follow

# View specific service metrics
gcloud run services describe quiz-mate --region us-central1
```

### Monitor Performance

1. **Firebase Console** → **Cloud Run** → Select `quiz-mate`
2. **Metrics tab**: View CPU, memory, request duration
3. **Logs tab**: View error and access logs

### Common Issues

#### Service won't start
```bash
# Check logs
gcloud run logs read quiz-mate --limit 50

# Redeploy from latest image
gcloud run deploy quiz-mate \
  --image gcr.io/agronomy-club/quiz-mate:latest \
  --platform managed \
  --region us-central1 \
  --force
```

#### Slow response times
1. Increase memory: `--memory 1Gi`
2. Increase CPU: `--cpu 2`
3. Check logs for bottlenecks

#### Connection issues from website
- Verify CORS is enabled (quiz-mate allows all origins by default)
- Check Cloud Run URL is correct in `.env`
- Ensure firewall rules allow outbound HTTPS

---

## Pricing & Costs

### Cloud Run Pricing
- **Compute**: invocations + vCPU-seconds + memory-GB-seconds
- **Free tier**: 2 million requests/month, 360,000 GB-seconds/month
- **Expected cost for typical usage**: $0-10/month

### Cost Optimization

```bash
# Set min instances to 0 (starts on demand)
gcloud run deploy quiz-mate \
  --min-instances 0 \
  --max-instances 10

# Monitor costs in GCP Console
# Billing → Reports → Filter by service (Cloud Run)
```

---

## Production Checklist

Before going live:

- [ ] Docker image builds without errors
- [ ] Image runs locally: `docker run -p 8080:8080 gcr.io/agronomy-club/quiz-mate:latest`
- [ ] Container pushed to GCR: `gcloud container images list`
- [ ] Cloud Run deployment successful: `gcloud run describe quiz-mate --region us-central1`
- [ ] Service URL accessible in browser
- [ ] Website updated with QUIZ_MATE_URL env var
- [ ] Navigation link to quiz-mate added to website
- [ ] Test creating and hosting a quiz
- [ ] Verify real-time updates (host → players)
- [ ] Test leaderboard display
- [ ] Check logs for errors: `gcloud run logs read quiz-mate`

---

## Maintenance

### Updating Quiz-Mate

When a new version is released:

```bash
# Pull latest from GitHub
cd ~/Documents/Agronomy-Club/quiz-mate
git pull origin main

# Rebuild Docker image
docker build -t gcr.io/agronomy-club/quiz-mate:v2.0.0 .

# Push new version
docker push gcr.io/agronomy-club/quiz-mate:v2.0.0

# Deploy new version
gcloud run deploy quiz-mate \
  --image gcr.io/agronomy-club/quiz-mate:v2.0.0 \
  --region us-central1
```

### Scheduled Restarts

Quiz-Mate stores everything in memory. For long-running deployments:

```bash
# Create a Cloud Scheduler job to restart daily (optional)
gcloud scheduler jobs create app-engine restart-quiz-mate \
  --schedule="0 2 * * *" \
  --http-method=POST \
  --uri="https://us-central1-run.googleapis.com/locations/us-central1/namespaces/agronomy-club/services/quiz-mate:runWithOverrides" \
  --oidc-service-account-email="default@appspot.gserviceaccount.com"
```

---

## Next Steps

1. **Deploy quiz-mate to Cloud Run** (this guide)
2. **Update website to link to quiz-mate** (see Integration section)
3. **Test quiz workflow**: Create → Host → Play → Leaderboard
4. **Monitor logs** and performance
5. **Document for users**: How to create and host quizzes

---

## Resources

- **Quiz-Mate GitHub**: https://github.com/david-04/quiz-mate
- **Cloud Run Documentation**: https://cloud.google.com/run/docs
- **GCP Pricing Calculator**: https://cloud.google.com/products/calculator
- **Cloud Run Limits**: https://cloud.google.com/run/quotas

---

## Support

If you encounter issues:

1. **Check Cloud Run logs**: `gcloud run logs read quiz-mate`
2. **Verify image in GCR**: `gcloud container images list --project=agronomy-club`
3. **Test Docker locally**: `docker run -p 8080:8080 gcr.io/agronomy-club/quiz-mate:latest`
4. **Review Quiz-Mate docs**: https://github.com/david-04/quiz-mate#readme

---

**Status**: Ready for deployment  
**Next**: Execute deployment steps above
