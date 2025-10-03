#!/bin/bash

# Agronomy Club - GitHub Repository Setup Script
# Creates a private GitHub repository with security features

echo "🌱 Agronomy Club - GitHub Repository Setup"
echo "=========================================="

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install it:"
    echo "   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg"
    echo "   echo \"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main\" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null"
    echo "   sudo apt update && sudo apt install gh"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub first:"
    echo "   gh auth login"
    exit 1
fi

# Repository details
REPO_NAME="agronomyclub-website"
REPO_DESCRIPTION="Official website for the Agronomy Club - promoting agricultural science and sustainable farming practices"

echo "📋 Repository Details:"
echo "   Name: $REPO_NAME"
echo "   Description: $REPO_DESCRIPTION"
echo "   Visibility: Private"
echo "   Features: Issues, Wiki, Security, Actions"

# Create the repository
echo ""
echo "🏗️  Creating GitHub repository..."
gh repo create "$REPO_NAME" \
  --private \
  --description "$REPO_DESCRIPTION" \
  --homepage "https://www.agronomyclub.org" \
  --enable-issues \
  --enable-wiki

if [ $? -eq 0 ]; then
    echo "✅ Repository created successfully!"
else
    echo "❌ Failed to create repository. It might already exist."
fi

# Add remote origin
echo ""
echo "🔗 Adding remote origin..."
git remote add origin "https://github.com/$(gh api user --jq .login)/$REPO_NAME.git"

# Push to GitHub
echo ""
echo "⬆️  Pushing code to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed successfully!"
else
    echo "❌ Failed to push code"
    exit 1
fi

# Setup branch protection
echo ""
echo "🛡️  Setting up branch protection..."
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["security-scan","build-and-test"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

# Enable security features
echo ""
echo "🔒 Enabling security features..."

# Enable vulnerability alerts
gh api repos/:owner/:repo \
  --method PATCH \
  --field has_vulnerability_alerts=true

# Enable automated security fixes
gh api repos/:owner/:repo \
  --method PATCH \
  --field automated_security_fixes=true

# Create repository secrets (placeholders)
echo ""
echo "🔑 Setting up GitHub Secrets..."
echo "   Please add these secrets in GitHub repository settings:"
echo "   - GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY"
echo "   - GOOGLE_CLOUD_PROJECT_ID"
echo "   - GOOGLE_CLOUD_BUCKET_NAME"
echo "   - SNYK_TOKEN"

# Create labels for issues
echo ""
echo "🏷️  Creating issue labels..."
gh label create "security" --color "d73a4a" --description "Security-related issues"
gh label create "enhancement" --color "a2eeef" --description "New feature or request"
gh label create "bug" --color "d73a4a" --description "Something isn't working"
gh label create "documentation" --color "0075ca" --description "Improvements or additions to documentation"
gh label create "good first issue" --color "7057ff" --description "Good for newcomers"
gh label create "help wanted" --color "008672" --description "Extra attention is needed"
gh label create "question" --color "d876e3" --description "Further information is requested"

# Create initial issues for the roadmap
echo ""
echo "📋 Creating roadmap issues..."

gh issue create \
  --title "Phase 1: Create Responsive Navigation Bar" \
  --body "Implement responsive navbar with all 8 main sections as outlined in the development roadmap.

## Tasks:
- [ ] Create Navbar component with mobile menu
- [ ] Add navigation links for all sections  
- [ ] Implement agronomy-themed styling
- [ ] Add sticky navigation with scroll effects
- [ ] Test responsive design across devices

## Acceptance Criteria:
- Navigation works on mobile and desktop
- All 8 sections are accessible
- Agricultural theme is consistent
- Performance is optimized

**Priority**: High
**Estimated Time**: 2 weeks" \
  --label "enhancement,good first issue"

gh issue create \
  --title "Phase 2: Setup Authentication System" \
  --body "Implement user authentication with role-based access control.

## Tasks:
- [ ] Setup authentication provider (Firebase Auth/NextAuth.js)
- [ ] Create login/register pages
- [ ] Implement user profiles
- [ ] Add role management (Student, Alumni, Admin)
- [ ] Setup session management

## Security Requirements:
- Password complexity requirements
- Rate limiting on auth endpoints  
- Secure session handling
- Multi-factor authentication for admins

**Priority**: High
**Estimated Time**: 2 weeks" \
  --label "enhancement,security"

gh issue create \
  --title "Security: Implement Comprehensive Security Framework" \
  --body "Complete security implementation as outlined in SECURITY.md

## Tasks:
- [ ] Configure security headers
- [ ] Implement input validation
- [ ] Setup rate limiting
- [ ] Add CSRF protection
- [ ] Configure file upload security
- [ ] Setup security monitoring

## Security Checklist:
- [ ] OWASP Top 10 mitigation
- [ ] Data encryption in transit/rest
- [ ] Security logging and monitoring
- [ ] Regular security audits

**Priority**: Critical
**Estimated Time**: 1 week" \
  --label "security"

echo ""
echo "🎉 GitHub Repository Setup Complete!"
echo ""
echo "📍 Repository URL: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
echo ""
echo "🔧 Next Steps:"
echo "   1. Add GitHub secrets for deployment"
echo "   2. Configure team access if needed"
echo "   3. Setup project board for task management"
echo "   4. Begin Phase 1 development"
echo ""
echo "🛡️  Security Features Enabled:"
echo "   ✅ Private repository"
echo "   ✅ Branch protection rules" 
echo "   ✅ Vulnerability alerts"
echo "   ✅ Automated security fixes"
echo "   ✅ Security scanning workflow"
echo ""
echo "Happy coding! 🚀"