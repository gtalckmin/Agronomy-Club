# Quick Reference: Agronomy Club Deployment

## 🎯 Status: LIVE IN PRODUCTION ✅

**URL**: https://agronomy-club.web.app

---

## 📱 Key URLs

| Page | URL |
|------|-----|
| Home | https://agronomy-club.web.app |
| Sign In | https://agronomy-club.web.app/auth/signin |
| Sign Up | https://agronomy-club.web.app/auth/signup |
| Member Directory | https://agronomy-club.web.app/members |
| Your Profile | https://agronomy-club.web.app/members/me |

---

## 🚀 Deploy Changes

```bash
cd ~/Documents/Agronomy-Club

# 1. Build production version
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting

# Optional: Deploy Firestore rules
firebase deploy --only firestore:rules
```

---

## 🧪 Test Locally

```bash
# Development mode (watch + hot reload)
npm run dev

# Production mode
npm run build && npm run start

# Open browser
open http://localhost:3000
```

---

## 📂 Important Files

```
├── firestore.rules          # Database security rules
├── firestore.indexes.json   # Query indexes
├── firebase.json            # Hosting + Firestore config
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── auth/        # Auth endpoints
    │   │   ├── members/     # Member endpoints
    │   │   └── chapters/    # Chapter endpoints
    │   ├── members/         # Member pages
    │   └── ...
    └── lib/
        └── firestore/
            └── schemas.ts   # Data types
```

---

## 🔑 Environment Variables

Located in `.env.local` (not committed):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=agronomy-club
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
FIREBASE_SERVICE_ACCOUNT_KEY=...
```

---

## 📊 Traffic & Performance

- **Hosting**: Firebase CDN (global)
- **Backend**: Cloud Run (auto-scaling, 0-10 instances)
- **Database**: Firestore (globally distributed)
- **Uptime**: 99.95% SLA

---

## 🔐 Access Control

| Role | Permissions |
|------|------------|
| **Member** | Read all profiles, edit own profile |
| **Chapter Lead** | Manage chapter info, moderate members |
| **Curator** | Create & edit quizzes |
| **Admin** | Full access to all data |

---

## 📈 API Endpoints

All require Firebase authentication token:

```bash
# Get current user
GET /api/auth/me
Header: Authorization: Bearer <token>

# List members (paginated)
GET /api/members/list?page=1&limit=10&search=john&chapter=Agriculture
Header: Authorization: Bearer <token>

# Get member profile
GET /api/members/[uid]
Header: Authorization: Bearer <token>

# Update own profile
PATCH /api/members/[uid]
Body: { bio, avatarUrl, chapterInterest, skills }
Header: Authorization: Bearer <token>

# List chapters
GET /api/chapters/list
Header: Authorization: Bearer <token>
```

---

## 🐛 Troubleshooting

### Check Deployment Status
```bash
firebase hosting:channel:list
```

### View Recent Deployments
```bash
firebase hosting:releases
```

### View Logs
```bash
firebase deploy --debug
gcloud functions describe ssragronomyclub --gen2
```

### Rollback
```bash
firebase hosting:rollback
```

---

## 🚧 Next Phase (Phase 3)

**Quiz-Mate Service** deployment:
- Build microservice (Python/Node.js)
- Containerize (Docker)
- Deploy to Cloud Run
- Connect to website

See `docs/quiz-mate-deployment.md` for full guide.

---

## 💬 Quick Help

**Q: How do I update the website?**
A: Edit code, run `npm run build && firebase deploy --only hosting`

**Q: How do I add a new member feature?**
A: Add page to `src/app/members/` and API to `src/app/api/members/`

**Q: How do I modify security rules?**
A: Edit `firestore.rules`, then run `firebase deploy --only firestore:rules`

**Q: Can I use custom domain?**
A: Not yet. Pending DNS setup in GoDaddy. See Firebase Console → Hosting → Add custom domain.

**Q: What's the cost?**
A: ~$0-5/month (within free tier limits)

---

## 📞 Emergency Contacts

- **Error in logs**: Check Firebase Console → Cloud Functions → Logs
- **Website down**: Check Firebase Hosting status
- **Database issues**: Check Firestore in Firebase Console
- **Domain problems**: Check GoDaddy DNS settings vs Firebase requirements

---

**Last Updated**: April 2026
**Status**: 🟢 LIVE
