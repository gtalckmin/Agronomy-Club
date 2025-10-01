# Agronomy Club Website

Welcome to the official website of the Agronomy Club - agronomyclub.org

## About

This website is built with Next.js and designed to be hosted on Google Cloud Platform. It serves as the digital presence for the Agronomy Club, promoting agricultural science and sustainable farming practices.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Hosting**: Google Cloud Platform
- **Domain**: agronomyclub.org (GoDaddy)

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

## Building for Production

1. Build the static export:
   ```bash
   npm run build
   ```

2. The output will be in the `out` folder, ready for deployment to Google Cloud Storage or App Engine.

## Deployment to Google Cloud (Free Tier Optimized)

### 🆓 **Free Tier Benefits**
- **Cloud Storage**: 5 GB free storage per month
- **Cloud CDN**: 1 TB free egress per month (Americas/EMEA)
- **Firebase Hosting**: 10 GB free hosting + SSL + CDN
- **App Engine**: 28 instance hours free per day (F1 instances)

### 🎯 **Option 1: Firebase Hosting (Recommended - Completely Free)**
Firebase Hosting provides free SSL, CDN, and custom domains:

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:
   ```bash
   firebase login
   firebase init hosting
   # Select: Use existing project -> agronomy-club
   # Public directory: out
   # Single-page app: No
   # Set up automatic builds: No
   ```

3. **Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

### 🏗️ **Option 2: Cloud Storage + Load Balancer (Free Tier)**
1. **Create bucket with unique name**:
   ```bash
   gsutil mb gs://agronomy-club-website-$(date +%s)
   export BUCKET_NAME=agronomy-club-website-$(date +%s)
   ```

2. **Upload files**:
   ```bash
   gsutil -m rsync -r -d ./out gs://$BUCKET_NAME
   ```

3. **Make bucket public**:
   ```bash
   gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
   gsutil web set -m index.html -e 404.html gs://$BUCKET_NAME
   ```

### 📱 **Option 3: App Engine Free Tier**
App Engine F1 instances are free (28 hours/day):

1. **Update app.yaml for free tier**:
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
After deployment, connect agronomyclub.org:
- **Firebase**: Use Firebase Console > Hosting > Connect Domain
- **Cloud Storage**: Set up CNAME in GoDaddy DNS
- **App Engine**: Use `gcloud app domain-mappings create`

### 💰 **Cost Optimization Tips**
- Use Firebase Hosting for zero costs
- Cloud Storage charges only after 5 GB
- App Engine F1 instances are free for light traffic
- All options include free SSL certificates

### 🚀 **Quick Deploy Scripts**

**1. Free Tier Deployment** (requires billing enabled):
```bash
./deploy-free-tier.sh
```

**2. Local Production Server** (test locally):
```bash
./serve-local.sh
```

### 📋 **Current Status & Next Steps**

✅ **Completed**:
- Website built and optimized
- Free tier deployment scripts ready
- Google Cloud project configured
- Local testing available

⚠️ **Required for Cloud Deployment**:
1. **Enable Billing**: Go to [Cloud Console Billing](https://console.cloud.google.com/billing)
2. **Link billing account** to `agronomy-club` project
3. **Run deployment**: `./deploy-free-tier.sh`

💡 **Free Tier Limits**:
- **Storage**: 5 GB/month free
- **Bandwidth**: 1 GB/month free egress
- **Estimated cost**: $0/month for typical small business website

🌐 **Domain Setup** (after deployment):

**Current Status**: ✅ Website deployed to: `agronomy-club-site-1759319875.storage.googleapis.com`

**GoDaddy DNS Changes Required**:

1. **Delete** the current A record:
   - Type: `A`
   - Name: `@` 
   - Data: `WebsiteBuilder Site`

2. **Edit** the existing CNAME record:
   - Type: `CNAME`
   - Name: `www`
   - **Change Data from**: `agronomyclub.org.`
   - **Change Data to**: `c.storage.googleapis.com`

3. **For the root domain (@), you have two options**:

   **Option A: Use GoDaddy's Domain Forwarding** (Recommended):
   - In GoDaddy, set up domain forwarding
   - Forward `agronomyclub.org` → `www.agronomyclub.org`
   - This is free and works perfectly with Google Cloud Storage

   **Option B: Use Google Cloud Load Balancer** (Advanced):
   - Create a load balancer with a static IP
   - Point A record to that IP
   - More complex but gives you more control

**After DNS changes**:
- ✅ `www.agronomyclub.org` → Your Google Cloud website
- ✅ `agronomyclub.org` → Redirects to www (via A record)
- ⏱️ DNS propagation: 1-48 hours

## Domain Configuration

The domain agronomyclub.org is registered with GoDaddy. To connect it to Google Cloud:

1. In GoDaddy's DNS management, add CNAME records pointing to your Google Cloud resources
2. For Cloud Storage: Create a CNAME pointing to `c.storage.googleapis.com`
3. For App Engine: Use the provided App Engine URL as the CNAME target

## Development

- Edit pages in `src/app/`
- Customize styles in `src/app/globals.css`
- Configure Tailwind colors and themes in `tailwind.config.js`

## License

© 2025 Agronomy Club. All rights reserved.