#!/bin/bash
# Final step: Bind the service account (run this in Cloud Shell)

PROJECT_ID="zyniq-core"
GITHUB_OWNER="ZYNIQ-AI-Driven-Development-Firm"
GITHUB_REPO="Ibrahim-El-Khalil-Portfolio-new-version"
SERVICE_ACCOUNT="github-actions-sa@${PROJECT_ID}.iam.gserviceaccount.com"
POOL_ID="projects/${PROJECT_ID}/locations/global/workloadIdentityPools/github-pool"

echo "Waiting 30 seconds for the pool to fully propagate..."
sleep 30

echo "Attempting to bind service account..."
gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/${GITHUB_OWNER}/${GITHUB_REPO}" \
    --project=$PROJECT_ID

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Binding successful!"
    echo ""
    echo "============================================================"
    echo "Add these GitHub Secrets:"
    echo "============================================================"
    echo ""
    echo "GCP_PROJECT_ID:"
    echo "zyniq-core"
    echo ""
    echo "WIF_PROVIDER:"
    echo "projects/71372052711/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
    echo ""
    echo "WIF_SERVICE_ACCOUNT:"
    echo "github-actions-sa@zyniq-core.iam.gserviceaccount.com"
    echo ""
    echo "GEMINI_API_KEY:"
    echo "YOUR_GEMINI_API_KEY"
    echo ""
    echo "MONGO_URL:"
    echo "YOUR_MONGODB_CONNECTION_STRING"
    echo ""
    echo "============================================================"
    echo ""
    echo "Go to: https://github.com/ZYNIQ-AI-Driven-Development-Firm/Ibrahim-El-Khalil-Portfolio-new-version/settings/secrets/actions"
else
    echo ""
    echo "Binding failed. The pool may need more time."
    echo "Please wait 2-3 minutes and run this script again."
fi
