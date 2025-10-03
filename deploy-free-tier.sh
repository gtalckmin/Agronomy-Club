#!/bin/bash

# Agronomy Club - Free Tier Deployment Script
# This script deploys your website using Google Cloud's free tier

echo "🌱 Agronomy Club - Free Tier Deployment"
echo "======================================"

# Check if gcloud is configured
if ! gcloud auth list --format="value(account)" | head -1 > /dev/null 2>&1; then
    echo "❌ Please run 'gcloud auth login' first"
    exit 1
fi

PROJECT_ID=$(gcloud config get-value project)
echo "📋 Project: $PROJECT_ID"

# Build the website
echo "🏗️  Building website..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Create unique bucket name (ephemeral). For production custom domain use deploy-domain.sh
BUCKET_NAME="agronomy-club-site-$(date +%s)"
echo "📦 Ephemeral Bucket (not mapped to custom domain): $BUCKET_NAME"

# Enable required APIs
echo "🔧 Enabling APIs..."
gcloud services enable storage-api.googleapis.com
gcloud services enable compute.googleapis.com

# Create storage bucket (free tier: 5GB)
echo "🪣 Creating storage bucket..."
gsutil mb gs://$BUCKET_NAME

# Upload website files
echo "⬆️  Uploading files..."
gsutil -m rsync -r -d ./out gs://$BUCKET_NAME

# Make bucket public (for web hosting)
echo "🌐 Configuring public access..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Configure for web hosting
echo "⚙️  Setting up web hosting..."
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME

# Set cache headers for optimization
echo "🚀 Optimizing cache headers..."
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/**/*.{js,css,png,jpg,jpeg,gif,svg,webp}

echo ""
echo "✅ Deployment Complete!"
echo "🔗 Your website is available at:"
echo "   http://$BUCKET_NAME.storage.googleapis.com"
echo "   https://storage.googleapis.com/$BUCKET_NAME/index.html"
echo ""
echo "💰 Free Tier Usage:"
echo "   📊 Storage: 5 GB free per month"
echo "   🌍 Bandwidth: 1 GB free egress to worldwide (except China & Australia)"
echo "   💵 Estimated monthly cost for small site: $0.00"
echo ""
echo "🌐 To connect your custom domain (agronomyclub.org) with free HTTPS:"
echo "   1. Create a free Cloudflare account at https://dash.cloudflare.com"
echo "   2. Add agronomyclub.org and update GoDaddy nameservers to Cloudflare's"
echo "   3. In Cloudflare DNS: set CNAME www -> c.storage.googleapis.com (Proxied)"
echo "   4. In Cloudflare SSL/TLS: mode 'Full', enable 'Always Use HTTPS'"
echo "   5. Optional: Forward @ to https://www.agronomyclub.org within Cloudflare"
echo ""
echo "📋 Bucket name saved in .env.local for future deployments"
echo "BUCKET_NAME=$BUCKET_NAME" > .env.local