# Agronomy Club Website

Welcome to the official website of the Agronomy Club - agronomyclub.org

## About

This website is built with Next.js and designed to be hosted on Google Cloud Platform. It serves as the digital presence for the Agronomy Club, promoting agricultural science and sustainable farming practices.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Cloud services**: Firebase Authentication, Firestore, Cloud Functions (via Firebase Hosting frameworks backend)
- **Hosting**: Firebase Hosting with Google-managed SSL and CDN
- **Domain**: agronomyclub.org (GoDaddy DNS)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configure Firebase authentication

1. In [Firebase Console](https://console.firebase.google.com/), create or select the Agronomy Club project and enable **Authentication → Sign-in method → Email/Password**.
2. Register a **Web App** to obtain the client config. Copy the keys into `.env.local` using the `NEXT_PUBLIC_FIREBASE_*` entries from `.env.example`.
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=""
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="agronomy-club"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
   NEXT_PUBLIC_FIREBASE_APP_ID=""
   ```
3. Enable **Firestore** in native mode. No indexes are required yet; a `users` collection will be created automatically.
4. Create a **service account** with the *Firebase Admin SDK Administrator* role and download the JSON key. Paste the JSON (escaped as shown in `.env.example`) into `FIREBASE_SERVICE_ACCOUNT_KEY`.
5. Restart the development server after updating environment variables so the Firebase SDKs pick up the new configuration.

## Building for Production

1. Create an optimized production build:
   ```bash
   npm run build
   ```

2. (Optional) Run the production server locally for a smoke test:
   ```bash
   npm run start
   ```

## Deployment to Google Cloud (Free Tier Optimized)

### 🆓 **Free Tier Benefits**
- **Firebase Hosting**: 10 GB free hosting + managed SSL + CDN
- **Cloud Functions for Firebase**: Handles Next.js server-side API routes (requires billing to be enabled even if you remain within free tier quotas)
- **Cloud Storage**: 5 GB free storage per month (for assets/backups)
- **App Engine**: 28 instance hours free per day (F1 instances) if you later need dynamic compute

### �️ **Option 1: Firebase Hosting (Primary Deployment Path)**
Firebase Hosting now serves the production site with Google-managed HTTPS and CDN. Because authentication relies on dynamic API routes, the Firebase CLI will automatically provision a lightweight Cloud Functions backend during deployment—no additional manual services are required beyond enabling billing on the Firebase project.

1. **Install Firebase CLI (once per machine)**:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Enable the web frameworks integration and initialize hosting** (first project setup):
   ```bash
   firebase experiments:enable webframeworks
   firebase init hosting
   # Project: agronomy-club
   # Use a web framework? Yes → Next.js
   # Public directory: .
   # Configure as SPA: No (Next.js handles routing)
   # Set up automatic builds and deploys with GitHub? Optional for now
   ```

3. **Deploy new builds** (the CLI will run `next build` for you):
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

4. **Connect the custom domain**:
   - Firebase Console → Hosting → Add custom domain → `www.agronomyclub.org`
   - Follow verification prompts (TXT record) in GoDaddy or Cloudflare DNS.
   - Once verified, add the Firebase-provided `A`/`AAAA` records (set Cloudflare proxy to DNS-only during provisioning).
   - Repeat for the apex domain (`agronomyclub.org`) and enable Firebase’s automatic redirect to `www`.

5. **Optional**: After Firebase certificates are active (usually within 10 minutes), re-enable Cloudflare’s proxy and keep SSL mode set to *Full*.

### � **Option 2: Cloud Storage + Cloudflare (Legacy Flow)**
If you need a fully static deployment, revert `next.config.js` to `output: 'export'`, remove the dynamic auth API routes, and use the existing `./deploy-domain.sh` pipeline along with the Cloudflare configuration in [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md).

### 📱 **Option 3: App Engine Free Tier (Dynamic Needs)**
If you require additional server-side features, App Engine F1 instances remain free for light workloads.

1. **Confirm `app.yaml` free-tier settings** (already provided):
   ```yaml
   runtime: nodejs20
   instance_class: F1
   automatic_scaling:
     max_instances: 1
     min_instances: 0
   ```

2. **Deploy**:
   ```bash
   gcloud app deploy
   ```

### 🌐 **Custom Domain Setup (Free)**
- **Firebase Hosting**: Connect the domain in Firebase Console; SSL is automatic.
- **Cloud Storage via Cloudflare**: Proxy `www` through Cloudflare for HTTPS and caching if you follow the legacy static deployment path.
- **App Engine**: Use `gcloud app domain-mappings create` (SSL provided at no cost).

### 💰 **Cost Optimization Tips**
- Keep static assets on Cloud Storage (5 GB free) with Cloudflare proxy for caching.
- Firebase Hosting stays free for low-traffic usage.
- App Engine F1 covers most low-traffic compute without charges.
- Monitor usage in Google Cloud console to stay within free tiers.

### 🚀 **Quick Deploy Scripts**

**1. Firebase Hosting Deployment** (requires billing enabled):
```bash
firebase experiments:enable webframeworks # only needed once per environment
firebase deploy --only hosting
```

**2. Local Production Server** (test locally):
```bash
npm run build
npm run start
```

### 📋 **Current Status & Next Steps**

✅ **Completed (Phase 1 & 2)**:
- Website built and deployed to Firebase Hosting at **https://agronomy-club.web.app**
- Firebase-backed authentication flows at `/auth/signin` and `/auth/signup`
- **Member Portal**: Full member directory at `/members` with user profiles and editing
- Member API endpoints: `/api/members/list`, `/api/members/[uid]`, `/api/chapters/list`
- **Firestore security rules deployed** — members can read all profiles, edit only their own
- Firestore indexes configured for efficient member queries
- Firebase Hosting configuration (`firebase.json`, `.firebaserc`) checked in
- Google Cloud project configured with frameworks backend at `us-central1`
- Dynamic account dashboard with authenticated navigation and sign-out controls
- Local testing available

✨ **Production URLs**:
- **Main site**: https://agronomy-club.web.app
- **Member Directory**: https://agronomy-club.web.app/members *(auth required)*
- **Member Profile Editor**: https://agronomy-club.web.app/members/me *(auth required)*

⏳ **In Progress (Phase 3)**:
- Quiz-mate service deployment to Cloud Run
- Custom domain setup: agronomyclub.org → www (awaiting DNS configuration)

💡 **Free Tier Limits**:
- **Storage**: 5 GB/month free
- **Bandwidth**: 1 GB/month free egress
- **Firestore**: 50K reads, 20K writes, 20K deletes/month free
- **Estimated cost**: $0/month if within free tier (billing required for SSR backend)

🌐 **Domain Setup with Firebase Hosting**

1. **Verify domain**: Firebase Console → Hosting → “Add custom domain” → `www.agronomyclub.org`.
2. **Point DNS**: Add the Firebase-provided `A` (and optional `AAAA`) records for both `www` and root domains. If using Cloudflare, keep them **DNS only** until the SSL certificate is issued.
3. **Apex redirect**: Accept Firebase’s automatic redirect from `agronomyclub.org` → `www.agronomyclub.org`.
4. **Optional Cloudflare proxy**: After the certificate is active, re-enable the orange-cloud proxy for analytics/WAF, keeping SSL on *Full*.

📌 **Current status**: Firebase Hosting is ready; run `firebase deploy --only hosting` after each build to publish updates.

## Development

- Edit pages in `src/app/`
- Customize styles in `src/app/globals.css`
- Configure Tailwind colors and themes in `tailwind.config.js`

## License

© 2025 Agronomy Club. All rights reserved.