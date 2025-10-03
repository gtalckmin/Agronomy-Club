#!/bin/bash

# Agronomy Club - Domain Deployment Script
# Deploys the static export to a stable bucket bound to www.agronomyclub.org
# Prerequisites:
#  1. Bucket names already created (www.agronomyclub.org) optionally (agronomyclub.org) for redirect
#  2. DNS: CNAME www -> c.storage.googleapis.com
#  3. (Optional) DNS: apex forwarding to https://www.agronomyclub.org OR load balancer config
#  4. gcloud auth login && gcloud config set project <PROJECT_ID>

set -euo pipefail

PRIMARY_BUCKET="www.agronomyclub.org"
APEX_BUCKET="agronomyclub.org"   # If you create this one, we can drop a redirect object

if ! command -v gcloud >/dev/null 2>&1; then
  echo "❌ gcloud CLI not installed. Install google-cloud-cli first." >&2
  exit 1
fi

if ! gcloud auth list --format="value(account)" | head -1 >/dev/null 2>&1; then
  echo "❌ Not authenticated. Run: gcloud auth login" >&2
  exit 1
fi

PROJECT_ID=$(gcloud config get-value project 2>/dev/null || true)
[ -z "$PROJECT_ID" ] && { echo "❌ No project set. Run: gcloud config set project <PROJECT_ID>"; exit 1; }

echo "🌱 Deploying Agronomy Club site to bucket: $PRIMARY_BUCKET (project: $PROJECT_ID)"

echo "🏗️  Building static export..."
npm run build

# Ensure buckets exist (idempotent checks)
ensure_bucket() {
  local B=$1
  if gsutil ls -b gs://$B >/dev/null 2>&1; then
    echo "✅ Bucket $B exists"
  else
    echo "🪣 Creating bucket $B"
    gsutil mb -p $PROJECT_ID gs://$B
  fi
  # Make public if not already
  if ! gsutil iam get gs://$B 2>/dev/null | grep -q 'allUsers".*"roles/storage.objectViewer'; then
    echo "🌐 Granting public read to $B"
    gsutil iam ch allUsers:objectViewer gs://$B
  fi
  echo "⚙️  Setting website main page for $B"
  gsutil web set -m index.html -e 404.html gs://$B || true
}

ensure_bucket "$PRIMARY_BUCKET"

# Optional apex bucket for redirect
if gsutil ls -b gs://$APEX_BUCKET >/dev/null 2>&1; then
  echo "🔁 Apex bucket present; ensuring redirect index"
  TMPDIR=$(mktemp -d)
  cat > "$TMPDIR/index.html" <<'HTML'
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Redirecting...</title>
<meta http-equiv="refresh" content="0; url=https://www.agronomyclub.org/">
<link rel="canonical" href="https://www.agronomyclub.org/">
</head>
<body>Redirecting to <a href="https://www.agronomyclub.org/">www.agronomyclub.org</a>...</body>
</html>
HTML
  gsutil -m rsync -r "$TMPDIR" gs://$APEX_BUCKET
  gsutil web set -m index.html -e 404.html gs://$APEX_BUCKET || true
  rm -rf "$TMPDIR"
fi

echo "🧹 Cleaning removed files in target bucket (rsync -d)"
gsutil -m rsync -r -d ./out gs://$PRIMARY_BUCKET

echo "🚀 Setting long-term cache headers for immutable assets"
gsutil -m setmeta -h "Cache-Control:public,max-age=31536000,immutable" \
  gs://$PRIMARY_BUCKET/_next/static/** || true

echo "🔍 Setting shorter cache for HTML"
mapfile -t html_objects < <(gsutil ls -r gs://$PRIMARY_BUCKET | grep '\.html$' || true)
if ((${#html_objects[@]} > 0)); then
  gsutil -m setmeta -h "Cache-Control:no-cache" "${html_objects[@]}" || true
fi

echo "✅ Deployment to $PRIMARY_BUCKET complete"
echo "   Test: https://storage.googleapis.com/$PRIMARY_BUCKET/index.html"
echo "   Live (via DNS): https://www.agronomyclub.org/"
