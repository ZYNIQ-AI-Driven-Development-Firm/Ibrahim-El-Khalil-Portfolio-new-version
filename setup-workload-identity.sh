#!/bin/bash

# Setup Workload Identity Federation for GitHub Actions
# This script configures secure authentication without JSON keys

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Setting up Workload Identity Federation ===${NC}\n"

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &>/dev/null; then
    echo -e "${RED}Error: Not authenticated to gcloud. Run 'gcloud auth login' first.${NC}"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project set. Run 'gcloud config set project YOUR_PROJECT_ID'${NC}"
    exit 1
fi

echo -e "Project ID: ${YELLOW}$PROJECT_ID${NC}\n"

# Prompt for GitHub repository details
read -p "Enter your GitHub username/organization: " GITHUB_OWNER
read -p "Enter your GitHub repository name: " GITHUB_REPO

echo -e "\n${GREEN}Step 1: Creating Workload Identity Pool...${NC}"
POOL_NAME="github-pool"
POOL_ID="projects/$PROJECT_ID/locations/global/workloadIdentityPools/$POOL_NAME"

if gcloud iam workload-identity-pools describe $POOL_NAME \
    --location=global --project=$PROJECT_ID &>/dev/null; then
    echo "Pool already exists, skipping creation"
else
    gcloud iam workload-identity-pools create $POOL_NAME \
        --location=global \
        --display-name="GitHub Actions Pool" \
        --project=$PROJECT_ID
    echo -e "${GREEN}✓ Pool created${NC}"
fi

echo -e "\n${GREEN}Step 2: Creating Workload Identity Provider...${NC}"
PROVIDER_NAME="github-provider"

if gcloud iam workload-identity-pools providers describe $PROVIDER_NAME \
    --workload-identity-pool=$POOL_NAME \
    --location=global --project=$PROJECT_ID &>/dev/null; then
    echo "Provider already exists, skipping creation"
else
    gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
        --workload-identity-pool=$POOL_NAME \
        --location=global \
        --issuer-uri="https://token.actions.githubusercontent.com" \
        --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
        --attribute-condition="assertion.repository_owner == '$GITHUB_OWNER'" \
        --project=$PROJECT_ID
    echo -e "${GREEN}✓ Provider created${NC}"
fi

echo -e "\n${GREEN}Step 3: Getting Service Account...${NC}"
SERVICE_ACCOUNT="github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com"

if gcloud iam service-accounts describe $SERVICE_ACCOUNT --project=$PROJECT_ID &>/dev/null; then
    echo "Service account exists: $SERVICE_ACCOUNT"
else
    echo -e "${RED}Error: Service account not found. Creating it...${NC}"
    gcloud iam service-accounts create github-actions-sa \
        --display-name="GitHub Actions Service Account" \
        --project=$PROJECT_ID
    
    # Grant necessary roles
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SERVICE_ACCOUNT" \
        --role="roles/run.admin"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SERVICE_ACCOUNT" \
        --role="roles/storage.admin"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SERVICE_ACCOUNT" \
        --role="roles/iam.serviceAccountUser"
    
    echo -e "${GREEN}✓ Service account created and configured${NC}"
fi

echo -e "\n${GREEN}Step 4: Binding Workload Identity to Service Account...${NC}"
gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/$POOL_ID/attribute.repository/$GITHUB_OWNER/$GITHUB_REPO" \
    --project=$PROJECT_ID

echo -e "${GREEN}✓ Binding complete${NC}"

echo -e "\n${GREEN}Step 5: Getting Workload Identity Provider ID...${NC}"
WIF_PROVIDER=$(gcloud iam workload-identity-pools providers describe $PROVIDER_NAME \
    --workload-identity-pool=$POOL_NAME \
    --location=global \
    --project=$PROJECT_ID \
    --format="value(name)")

echo -e "${GREEN}✓ Configuration complete!${NC}\n"

echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Add these secrets to your GitHub repository:${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}GCP_PROJECT_ID:${NC}"
echo "$PROJECT_ID"
echo ""

echo -e "${YELLOW}WIF_PROVIDER:${NC}"
echo "$WIF_PROVIDER"
echo ""

echo -e "${YELLOW}WIF_SERVICE_ACCOUNT:${NC}"
echo "$SERVICE_ACCOUNT"
echo ""

echo -e "${YELLOW}GEMINI_API_KEY:${NC}"
echo "YOUR_GEMINI_API_KEY_HERE"
echo ""

echo -e "${YELLOW}MONGO_URL:${NC}"
echo "YOUR_MONGODB_CONNECTION_STRING_HERE"
echo ""

echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "\n${GREEN}How to add secrets to GitHub:${NC}"
echo "1. Go to: https://github.com/$GITHUB_OWNER/$GITHUB_REPO/settings/secrets/actions"
echo "2. Click 'New repository secret'"
echo "3. Add each secret above"
echo ""
echo -e "${GREEN}Done! Your GitHub Actions workflow can now deploy to Cloud Run.${NC}"
