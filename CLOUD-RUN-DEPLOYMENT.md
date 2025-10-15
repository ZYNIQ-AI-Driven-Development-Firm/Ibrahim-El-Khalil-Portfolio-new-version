# Google Cloud Run Deployment Guide

This guide walks you through deploying the Ibrahim El Khalil Portfolio to Google Cloud Run with automatic deployment on push to main branch, and connecting your custom domain `khalilpreview.space`.

## Prerequisites

1. Google Cloud Platform account
2. `gcloud` CLI installed ([Install Guide](https://cloud.google.com/sdk/docs/install))
3. GitHub repository with the code
4. Domain: `khalilpreview.space`

## Step 1: Initial Google Cloud Setup

### 1.1 Create a New GCP Project

```bash
# Set your project ID
export PROJECT_ID="ibrahim-portfolio"

# Create the project
gcloud projects create $PROJECT_ID --name="Ibrahim Portfolio"

# Set as default project
gcloud config set project $PROJECT_ID

# Link billing account (required for Cloud Run)
gcloud billing accounts list
gcloud billing projects link $PROJECT_ID --billing-account=YOUR_BILLING_ACCOUNT_ID
```

### 1.2 Enable Required APIs

```bash
# Enable necessary Google Cloud APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  compute.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com
```

### 1.3 Set Up MongoDB (Choose One Option)

#### Option A: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Set up database user and password
4. Add IP `0.0.0.0/0` to whitelist (for Cloud Run)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/portfolio_db`

#### Option B: Cloud SQL for MongoDB (More Expensive)

```bash
# Create Cloud SQL instance with MongoDB
gcloud sql instances create portfolio-mongodb \
  --database-version=MONGODB_4_0 \
  --tier=db-n1-standard-1 \
  --region=us-central1
```

## Step 2: Set Up Service Account for GitHub Actions

### 2.1 Create Service Account

```bash
# Create service account
gcloud iam service-accounts create github-actions-sa \
  --display-name="GitHub Actions Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create ~/gcloud-key.json \
  --iam-account=github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com

# Display the key (copy this for GitHub Secrets)
cat ~/gcloud-key.json | base64
```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

1. **GCP_PROJECT_ID**: Your GCP Project ID (e.g., `ibrahim-portfolio`)
2. **GCP_SA_KEY**: The base64-encoded service account key from Step 2.1
3. **GEMINI_API_KEY**: Your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **MONGO_URL**: Your MongoDB connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/portfolio_db?authSource=admin`)

### Adding Secrets via GitHub CLI (Optional)

```bash
gh secret set GCP_PROJECT_ID --body "ibrahim-portfolio"
gh secret set GCP_SA_KEY --body "$(cat ~/gcloud-key.json | base64)"
gh secret set GEMINI_API_KEY --body "your_gemini_api_key"
gh secret set MONGO_URL --body "mongodb+srv://user:pass@cluster.mongodb.net/portfolio_db"
```

## Step 4: Manual First Deployment (Optional)

Before pushing to trigger automatic deployment, you can do a manual deployment:

```bash
# Set region
export REGION="us-central1"

# Build and deploy backend
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/portfolio-backend
gcloud run deploy portfolio-backend \
  --image gcr.io/$PROJECT_ID/portfolio-backend \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --set-env-vars MONGO_URL="your_mongo_url",DATABASE_NAME=portfolio_db

# Get backend URL
export BACKEND_URL=$(gcloud run services describe portfolio-backend --region $REGION --format 'value(status.url)')
echo "Backend URL: $BACKEND_URL"

# Build and deploy frontend
cd ../frontend
gcloud builds submit --tag gcr.io/$PROJECT_ID/portfolio-frontend \
  --build-arg GEMINI_API_KEY="your_gemini_key"
gcloud run deploy portfolio-frontend \
  --image gcr.io/$PROJECT_ID/portfolio-frontend \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 256Mi \
  --port 80 \
  --set-env-vars REACT_APP_API_URL=$BACKEND_URL/api,REACT_APP_BACKEND_URL=$BACKEND_URL,REACT_APP_GEMINI_API_KEY="your_gemini_key"

# Get frontend URL
export FRONTEND_URL=$(gcloud run services describe portfolio-frontend --region $REGION --format 'value(status.url)')
echo "Frontend URL: $FRONTEND_URL"
```

## Step 5: Configure Custom Domain (khalilpreview.space)

### 5.1 Verify Domain Ownership

```bash
# Start domain verification
gcloud domains verify khalilpreview.space

# Follow the instructions to add DNS TXT record for verification
```

### 5.2 Map Domain to Cloud Run Service

```bash
# Map domain to frontend service
gcloud run domain-mappings create \
  --service portfolio-frontend \
  --domain khalilpreview.space \
  --region us-central1

# Map subdomain for backend (optional)
gcloud run domain-mappings create \
  --service portfolio-backend \
  --domain api.khalilpreview.space \
  --region us-central1
```

### 5.3 Update DNS Records

After running the domain mapping command, Google will provide DNS records. Add these to your domain registrar:

**For khalilpreview.space:**
- Type: `A`
- Name: `@`
- Value: `<IP provided by Google>`

**For www.khalilpreview.space:**
- Type: `CNAME`
- Name: `www`
- Value: `ghs.googlehosted.com`

**For api.khalilpreview.space (if mapping backend):**
- Type: `CNAME`
- Name: `api`
- Value: `ghs.googlehosted.com`

### 5.4 Check Domain Mapping Status

```bash
# Check domain mapping status
gcloud run domain-mappings list --region us-central1

# It may take up to 15 minutes for DNS to propagate
```

## Step 6: Set Up Automatic Deployment

Now that everything is configured, every push to the `main` branch will automatically:

1. Build Docker images for frontend and backend
2. Push images to Google Container Registry
3. Deploy to Cloud Run
4. Update environment variables

### Test the Workflow

```bash
# Make a small change and push
git add .
git commit -m "test: Trigger automatic deployment"
git push origin main

# Watch the deployment in GitHub Actions
# Go to: https://github.com/your-username/your-repo/actions
```

## Step 7: Post-Deployment Configuration

### 7.1 Set Up CORS (if needed)

Update backend to allow your custom domain:

```python
# In backend/server.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://khalilpreview.space",
        "https://www.khalilpreview.space"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 7.2 Update Frontend Environment Variables

After deployment, update the frontend to use the custom domain:

```bash
gcloud run services update portfolio-frontend \
  --region us-central1 \
  --set-env-vars REACT_APP_BACKEND_URL=https://api.khalilpreview.space
```

### 7.3 Set Up Cloud Monitoring (Optional)

```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=portfolio-frontend" --limit 50
```

## Step 8: MongoDB Data Migration

After deployment, migrate your data:

```bash
# Option 1: Using the provided script
python migrate_data.py

# Option 2: Manually via API
curl -X POST https://api.khalilpreview.space/api/migrate \
  -H "Content-Type: application/json" \
  -d @migration-data.json
```

## Cost Estimation

### Cloud Run Costs (Approximate)
- Frontend: ~$5-10/month (depending on traffic)
- Backend: ~$10-20/month (depending on traffic)
- Free tier: 2 million requests/month

### MongoDB Atlas
- Free tier: 512MB storage, shared cluster
- Basic paid: $9-25/month for dedicated cluster

### Total Estimated: $0-50/month (depending on traffic and MongoDB choice)

## Troubleshooting

### Issue: Deployment Fails

```bash
# Check build logs
gcloud builds list --limit=5
gcloud builds log <BUILD_ID>

# Check service logs
gcloud run logs read portfolio-frontend --region us-central1 --limit=50
gcloud run logs read portfolio-backend --region us-central1 --limit=50
```

### Issue: Domain Not Working

```bash
# Check domain mapping
gcloud run domain-mappings describe khalilpreview.space \
  --region us-central1 \
  --service portfolio-frontend

# Verify DNS propagation
nslookup khalilpreview.space
dig khalilpreview.space
```

### Issue: Frontend Can't Connect to Backend

```bash
# Check environment variables
gcloud run services describe portfolio-frontend \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"

# Update if needed
gcloud run services update portfolio-frontend \
  --region us-central1 \
  --set-env-vars REACT_APP_BACKEND_URL=https://api.khalilpreview.space
```

## Useful Commands

```bash
# View all services
gcloud run services list

# Describe a service
gcloud run services describe portfolio-frontend --region us-central1

# Update service configuration
gcloud run services update portfolio-frontend --region us-central1 --memory 512Mi

# Delete a service
gcloud run services delete portfolio-frontend --region us-central1

# Rollback to previous revision
gcloud run services update-traffic portfolio-frontend --region us-central1 --to-revisions LATEST=100

# View service URL
gcloud run services describe portfolio-frontend --region us-central1 --format 'value(status.url)'
```

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use Secret Manager** for sensitive data:
   ```bash
   gcloud secrets create gemini-api-key --data-file=-
   ```
3. **Enable authentication** for admin endpoints
4. **Set up Cloud Armor** for DDoS protection
5. **Use VPC** for backend-database communication
6. **Enable Cloud Audit Logs** for compliance

## Next Steps

1. ✅ Push code to main branch
2. ✅ Watch GitHub Actions deploy automatically
3. ✅ Verify deployment at Cloud Run URLs
4. ✅ Configure custom domain
5. ✅ Test the live site
6. ✅ Set up monitoring and alerts
7. ✅ Configure backups for MongoDB

## Support

- Cloud Run Documentation: https://cloud.google.com/run/docs
- GitHub Actions: https://docs.github.com/en/actions
- MongoDB Atlas: https://docs.atlas.mongodb.com/

---

**Deployment Status**: Ready for production! 🚀
