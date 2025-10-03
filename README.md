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
- **Cloudflare**: Free CDN + SSL + WAF for proxied traffic
- **Firebase Hosting**: 10 GB free hosting + SSL + CDN
- **App Engine**: 28 instance hours free per day (F1 instances)

### �️ **Option 1: Cloud Storage + Cloudflare (Recommended & Free)**
Use Google Cloud Storage for hosting and Cloudflare for HTTPS, caching, and security at zero cost.

1. **Deploy to the custom domain bucket**:
   ```bash
   ./deploy-domain.sh
   ```

2. **Create a Cloudflare account (free)** at [cloudflare.com](https://dash.cloudflare.com/) and add `agronomyclub.org` as a site.

3. **Update GoDaddy nameservers** to the two Cloudflare nameservers shown during setup. DNS propagation can take up to 24 hours.

4. **Configure Cloudflare DNS**:
   - `www` → `c.storage.googleapis.com` (CNAME, **Proxied** / orange cloud)
   - `@` → `www.agronomyclub.org` (CNAME flattening) or enable Page Rule forwarding `@` → `https://www.agronomyclub.org`

5. **Enable SSL & redirects in Cloudflare**:
   - SSL/TLS mode: **Full**
   - Edge Certificates: turn on **Always Use HTTPS** and **Automatic HTTPS Rewrites**
   - Optional: cache everything rule for `/` with edge cache TTL ≥ 1 hour

Once DNS propagates, `https://www.agronomyclub.org` serves via Cloudflare with free HTTPS while GCS stays the origin.

📘 Need the full playbook? See [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md).

### 🔐 **Option 2: Firebase Hosting (Zero-Cost Alternative)**
Firebase Hosting also includes free SSL and CDN, and may be easier if you prefer not to manage DNS nameservers.

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize & deploy**:
   ```bash
   firebase login
   firebase init hosting
   # Use existing project -> agronomy-club
   # Public directory: out
   # Configure as SPA: No
   npm run build
   firebase deploy
   ```

### 📱 **Option 3: App Engine Free Tier (Dynamic Needs)**
If you later require server-side features, App Engine F1 instances are free for light workloads.

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
- **Cloud Storage via Cloudflare (recommended)**: Proxy `www` through Cloudflare for free TLS and caching, forward root to `www` inside Cloudflare.
- **Firebase Hosting**: Connect the domain in Firebase Console; SSL is automatic.
- **App Engine**: Use `gcloud app domain-mappings create` (SSL provided at no cost).

### 💰 **Cost Optimization Tips**
- Keep static hosting on Cloud Storage (5 GB free) with Cloudflare proxy for HTTPS and caching.
- Firebase Hosting remains free for small usage.
- App Engine F1 covers most low-traffic needs without charges.
- Monitor usage in Google Cloud console to stay within free tiers.

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