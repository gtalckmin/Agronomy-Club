# Security Handover Checklist

Use this checklist before sharing this repository with new maintainers.

## 1) Rotate exposed credentials first

If any key/token was ever present in a local file or commit history, rotate it before handover:

1. Revoke old Firebase service-account keys in Google Cloud IAM.
2. Create fresh credentials with least privilege.
3. Update runtime secret stores (not repository files).

Important: `.gitignore` does not protect secrets that were already committed.

## 2) Share only sanitized repository content

Do not share workspace zips that include ignored files.

Safe to share:

- `.env.example` (placeholders only)
- source code and documentation

Do not share:

- `.env.local`
- any `*service-account*.json` key file
- generated local config files under `.firebase/`
- private key files (`*.pem`, `*.key`, `*.p12`)

## 3) If secrets were committed, clean git history

If a secret reached git history, remove it from history and force-push with team coordination.

Suggested approach:

1. Rotate credentials before rewrite.
2. Rewrite history with a repository filtering tool.
3. Force-push and notify collaborators to re-clone.
4. Rotate credentials again after rewrite as defense-in-depth.

## 4) Enforce prevention controls

This repository includes `.github/workflows/secret-scan.yml` to scan pushes and pull requests.

Recommended additions for local development:

1. Install pre-commit hooks for secret scanning.
2. Block commits containing private-key headers, cloud tokens, and API keys.

## 5) Teammate onboarding requirements

1. Copy `.env.example` to `.env.local`.
2. Request secrets through secure channels only (never in git).
3. Use least-privilege IAM roles.
4. Keep local key files outside the repository when possible.

## 6) Final validation before handover

1. Run CI and confirm secret scan passes.
2. Verify no tracked file contains live credentials.
3. Confirm old credentials are disabled.
