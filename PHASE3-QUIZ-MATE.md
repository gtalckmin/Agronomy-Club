# Phase 3: Quiz-Mate Deployment Guide

## Ready for Deployment ✅

All prerequisites are complete:
- ✅ Quiz-Mate repository cloned
- ✅ Docker image tested locally (builds successfully, responds on port 8080)
- ✅ Cloud Run configuration prepared
- ✅ Deployment script created
- ✅ Documentation written

---

## Quick Start: Deploy Quiz-Mate

### Option 1: Automated Deployment (Recommended)

```bash
cd ~/Documents/Agronomy-Club/quiz-mate

# Make script executable
chmod +x deploy.sh

# Run automated deployment
./deploy.sh
```

This script will:
1. ✅ Verify prerequisites (Docker, gcloud)
2. ✅ Build Docker image locally
3. ✅ Test image on port 8080
4. ✅ Push to Google Container Registry (GCR)
5. ✅ Deploy to Cloud Run
6. ✅ Show you the live URL

### Option 2: Manual Steps

**Step 1: Build Docker Image**
```bash
cd ~/Documents/Agronomy-Club/quiz-mate
docker build -f Dockerfile.cloudrun -t quiz-mate:latest .
```

**Step 2: Configure gcloud**
```bash
gcloud config set project agronomy-club
gcloud auth configure-docker
```

**Step 3: Tag and Push to GCR**
```bash
docker tag quiz-mate:latest gcr.io/agronomy-club/quiz-mate:latest
docker push gcr.io/agronomy-club/quiz-mate:latest
```

**Step 4: Deploy to Cloud Run**
```bash
gcloud run deploy quiz-mate \
  --image gcr.io/agronomy-club/quiz-mate:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --port 8080
```

**Step 5: Get the URL**
```bash
gcloud run services describe quiz-mate --region us-central1 --format 'value(status.url)'
```

---

## After Deployment

### 1. Update Website Configuration

Add the Quiz-Mate URL to `.env.local`:

```bash
NEXT_PUBLIC_QUIZ_MATE_URL=https://quiz-mate-xxx.run.app
```

### 2. Add Quiz Link to Website (Optional)

Create a new page `src/app/quizzes/page.tsx`:

```typescript
import Link from "next/link";

export default function QuizzesPage() {
  const quizMateUrl = process.env.NEXT_PUBLIC_QUIZ_MATE_URL;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-green-800 mb-6">
          Interactive Quizzes
        </h1>
        
        <p className="text-lg text-gray-700 mb-8">
          Challenge yourself with our interactive quiz-mate platform. 
          Answer real-time questions, see instant feedback, and compete 
          on the leaderboard!
        </p>

        <div className="bg-green-50 p-8 rounded-lg border border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Ready to test your knowledge?
          </h2>
          
          <a
            href={quizMateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Open Quiz-Mate →
          </a>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-green-800 mb-3">
              For Hosts
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Create custom quizzes</li>
              <li>Host real-time quiz sessions</li>
              <li>View answer statistics</li>
              <li>Share QR code with players</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-green-800 mb-3">
              For Players
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Join quizzes with code</li>
              <li>Answer questions in real-time</li>
              <li>See instant feedback</li>
              <li>Check the leaderboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Update Navigation

Add link to navbar in `src/components/navigation/Navbar.tsx`:

```typescript
// Add to the navigation menu:
<Link href="/quizzes" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-50">
  Quizzes
</Link>
```

### 4. Deploy Website Updates

```bash
npm run build && firebase deploy --only hosting
```

---

## Testing

### Test Quiz-Mate

1. Open the Quiz-Mate URL in browser
2. Click **"Host a quiz"**
3. Create a simple test quiz
4. Download the quiz.json
5. Upload and start the quiz
6. Join as a player from another tab
7. Answer questions
8. Verify leaderboard works

### Monitor Logs

```bash
# View real-time logs
gcloud run logs read quiz-mate --limit 50 --follow

# Check specific error
gcloud run logs read quiz-mate --limit 100 | grep ERROR
```

---

## Architecture

```
Agronomy Club Website
  https://agronomy-club.web.app
  
  ├─ /quizzes ────┐
  │               │ (link or embed)
  │               ▼
  │   Quiz-Mate Service
  │   https://quiz-mate-xxx.run.app
  │   - React frontend
  │   - Express + Socket.io backend
  │   - Real-time WebSocket communication
  │   - Leaderboard & statistics
  │
  └─ Other pages (members, about, etc.)
```

---

## Files Structure

```
quiz-mate/
├── Dockerfile           # Default configuration (ports 3001/3002)
├── Dockerfile.cloudrun  # Cloud Run optimized (port 8080) ✅ USE THIS
├── deploy.sh           # Automated deployment script
├── .gcloudignore      # Files to exclude from Cloud Run
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express.js server
│   ├── src/
│   ├── quiz-mate.cfg  # Configuration file
│   └── package.json
└── resources/         # Sample quizzes and SSL certs
```

---

## Cloud Run Configuration

| Setting | Value |
|---------|-------|
| **Project** | agronomy-club |
| **Service** | quiz-mate |
| **Region** | us-central1 |
| **Port** | 8080 |
| **Memory** | 512 MB |
| **CPU** | 1 vCPU |
| **Timeout** | 1 hour |
| **Max Instances** | 10 |
| **Min Instances** | 0 (auto-scale down) |
| **Authentication** | Allow unauthenticated (public) |

---

## Cost Estimate

**Monthly Cost**: $0-5 USD (typical usage)

- Cloud Run invocations: FREE (first 2M/month)
- vCPU-seconds: FREE (first 360,000/month)
- GB-seconds: FREE (first 180,000/month)
- Additional usage: ~$0.00002 per request

*Note: This assumes low traffic (<100 concurrent users). High traffic will increase costs.*

---

## Troubleshooting

### "Image not found in GCR"
```bash
# Verify image was pushed
gcloud container images list --project=agronomy-club

# Check image details
gcloud container images describe gcr.io/agronomy-club/quiz-mate:latest
```

### "Service failing to start"
```bash
# Check logs for errors
gcloud run logs read quiz-mate --limit 100

# View service details
gcloud run describe quiz-mate --region us-central1
```

### "Port 8080 not working"
```bash
# Verify Docker image runs locally
docker run -p 8080:8080 gcr.io/agronomy-club/quiz-mate:latest

# Check curl response
curl http://localhost:8080/
```

### "Connection refused from website"
1. Verify `NEXT_PUBLIC_QUIZ_MATE_URL` in `.env.local`
2. Check Cloud Run service allows unauthenticated access
3. Verify CORS headers (quiz-mate allows all origins by default)
4. Check firewall rules allow HTTPS egress

---

## Key Resources

- **Quiz-Mate GitHub**: https://github.com/david-04/quiz-mate
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **Setup Guide**: `docs/QUIZ-MATE-SETUP.md`
- **Pricing**: https://cloud.google.com/run/pricing

---

## Summary

**Status**: ✅ Ready to deploy

**Next Action**: Run `./quiz-mate/deploy.sh` to complete Phase 3

**Expected Time**: ~10-15 minutes (build + deploy)

**Result**: Quiz-Mate live at https://quiz-mate-xxx.run.app

---

**Questions?** See `docs/QUIZ-MATE-SETUP.md` for detailed documentation.
