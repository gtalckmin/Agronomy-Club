# Cloudflare Proxy Setup (Free HTTPS)

This guide walks you through enabling HTTPS for `www.agronomyclub.org` while keeping Google Cloud Storage (GCS) as the origin, using Cloudflare's free tier.

## 1. Prep Checklist

- ✅ Static site deployed to the `www.agronomyclub.org` bucket (run `./deploy-domain.sh`)
- ✅ Access to the GoDaddy registrar account for agronomyclub.org
- ✅ Cloudflare account (free tier)

## 2. Add the Site to Cloudflare

1. Sign in to [Cloudflare](https://dash.cloudflare.com) and click **Add a Site**.
2. Enter `agronomyclub.org` and choose the **Free** plan.
3. Cloudflare scans existing DNS records; keep anything you still need and continue.
4. Cloudflare will display two authoritative nameservers (e.g., `ada.ns.cloudflare.com`). Keep this tab open.

## 3. Update GoDaddy Nameservers

1. Log in to GoDaddy → **Domains** → select `agronomyclub.org` → **Manage DNS**.
2. Under **Nameservers**, choose **Change** → **Enter my own nameservers (advanced)**.
3. Replace the existing nameservers with the two from Cloudflare and save.
4. DNS propagation can take from a few minutes up to 24 hours. Cloudflare will email you once your domain is active.

> ℹ️ During propagation, some users may still see the old GoDaddy parking page. This is expected.

## 4. Configure DNS in Cloudflare

| Type | Name | Target | Proxy | TTL |
|------|------|--------|-------|-----|
| CNAME | `www` | `c.storage.googleapis.com` | **Proxied** (orange cloud) | Auto |
| CNAME | `@` | `www.agronomyclub.org` | **Proxied** | Auto |

- Cloudflare automatically enables **CNAME flattening** for the root (`@`), letting it behave like an A record.
- If you prefer a redirect instead, delete the root CNAME and add a **Page Rule**:
  - URL: `agronomyclub.org/*`
  - Setting: **Forwarding URL (301)** → `https://www.agronomyclub.org/$1`

## 5. Enable SSL and Redirects

In Cloudflare → **SSL/TLS** → **Overview**:

- Set **SSL/TLS encryption mode** to **Full** (not Flexible).
- Under **Edge Certificates**, toggle on:
  - **Always Use HTTPS**
  - **Automatic HTTPS Rewrites**
- Optional hardening: enable **HSTS** after confirming HTTPS works end to end.

## 6. Performance Tweaks (Optional)

- **Caching**: Add a Page Rule for `www.agronomyclub.org/*` → *Cache Level: Cache Everything* with an Edge Cache TTL of at least 1 hour. Static `_next/static` files are already cache-friendly.
- **Security**: Leave the default Cloudflare security level (`Medium`) or adjust to your needs.
- **Analytics**: Cloudflare provides request/traffic graphs even on the free plan.

## 7. Verify the Setup

1. Wait until Cloudflare marks the domain as **Active**.
2. Visit `https://www.agronomyclub.org`. The browser lock icon should appear with a valid certificate issued by Cloudflare.
3. Run a quick header check:
   ```bash
   curl -I https://www.agronomyclub.org
   ```
   You should see `Server: cloudflare` and `cf-cache-status` headers.
4. Confirm that `http://` automatically redirects to `https://`.

## 8. Ongoing Deployments

- Continue to deploy with `./deploy-domain.sh` or `./deploy-free-tier.sh`.
- Cloudflare caches assets, so after a deployment you can **Purge Cache → Purge Everything** in Cloudflare, or rely on cache-versioned file names (_next static assets already have hashes).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Browser shows GoDaddy parking page | Nameserver propagation still in progress—wait or double-check nameservers. |
| Cloudflare SSL shows "Flexible" | Change the mode to **Full** to avoid redirect loops. |
| 525/526 errors | Ensure the GCS bucket is publicly accessible and Cloudflare proxy points to `c.storage.googleapis.com`. |
| Mixed content warnings | All site assets should load over HTTPS; Next.js static export already does this. |

With Cloudflare in place, you keep Google Cloud's free hosting while adding enterprise-grade HTTPS and caching at zero cost.
