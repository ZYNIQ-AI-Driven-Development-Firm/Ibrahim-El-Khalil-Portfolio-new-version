# Complete Workload Identity Setup in Google Cloud Shell

The pool and provider have been created! Now you need to complete the binding step.

## Step 1: Open Google Cloud Shell

1. Go to: https://console.cloud.google.com
2. Click the **Cloud Shell icon (>_)** in the top-right corner
3. Wait for it to initialize

## Step 2: Run These Commands

Copy and paste these commands **one at a time** into Cloud Shell:

```bash
# Set your project
PROJECT_ID="zyniq-core"
gcloud config set project $PROJECT_ID

# Set GitHub details
GITHUB_OWNER="ZYNIQ-AI-Driven-Development-Firm"
GITHUB_REPO="Ibrahim-El-Khalil-Portfolio-new-version"
SERVICE_ACCOUNT="github-actions-sa@${PROJECT_ID}.iam.gserviceaccount.com"
POOL_ID="projects/${PROJECT_ID}/locations/global/workloadIdentityPools/github-pool"

# Wait a moment for the pool to be fully ready
echo "Waiting 10 seconds for pool to propagate..."
sleep 10

# Bind the service account to the workload identity
gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/${GITHUB_OWNER}/${GITHUB_REPO}" \
    --project=zyniq-core

# Get the provider ID (copy this output!)
echo ""
echo "========================================="
echo "Workload Identity Provider ID:"
echo "========================================="
gcloud iam workload-identity-pools providers describe github-provider \
    --workload-identity-pool=github-pool \
    --location=global \
    --project=$PROJECT_ID \
    --format="value(name)"
echo ""
echo "========================================="
```

## Step 3: Copy the Output

You'll see output like:
```
projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

**Copy this entire line** - you'll need it for GitHub Secrets.

## Step 4: Add GitHub Secrets

Go to: https://github.com/ZYNIQ-AI-Driven-Development-Firm/Ibrahim-El-Khalil-Portfolio-new-version/settings/secrets/actions

Click **"New repository secret"** and add each of these:

### Secret 1: GCP_PROJECT_ID
```
zyniq-core
```

### Secret 2: WIF_PROVIDER
```
projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```
(Paste the output from Step 3)

### Secret 3: WIF_SERVICE_ACCOUNT
```
github-actions-sa@zyniq-core.iam.gserviceaccount.com
```

### Secret 4: GEMINI_API_KEY
Get from: https://makersuite.google.com/app/apikey
```
AIza...your-key-here
```

### Secret 5: MONGO_URL
Your MongoDB Atlas connection string (or use the VM deployment option)
```
mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
```

## Step 5: Test the Deployment

After adding all secrets, test it:

```bash
# Make a small change
echo "# Testing auto-deploy" >> README.md

# Commit and push
git add .
git commit -m "test: Verify auto-deployment"
git push origin main
```

Watch the deployment at:
https://github.com/ZYNIQ-AI-Driven-Development-Firm/Ibrahim-El-Khalil-Portfolio-new-version/actions

---

## Troubleshooting

### If binding fails with "Identity Pool does not exist"
The pool needs more time to propagate. Wait 2-3 minutes and try again.

### If you get permission errors
Make sure you're authenticated:
```bash
gcloud auth login
```

### Need to start over?
Delete and recreate:
```bash
# Delete provider
gcloud iam workload-identity-pools providers delete github-provider \
    --workload-identity-pool=github-pool \
    --location=global \
    --project=zyniq-core

# Delete pool
gcloud iam workload-identity-pools delete github-pool \
    --location=global \
    --project=zyniq-core

# Then run setup-workload-identity.sh again
```
