#!/bin/bash
# Quick Deploy Script for Google Cloud Run

set -e

echo "🚀 Ibrahim Portfolio - Cloud Run Deployment Script"
echo "=================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "⚠️  .env.production not found. Using manual input..."
fi

# Prompt for required variables
read -p "Enter GCP Project ID [$PROJECT_ID]: " input_project
PROJECT_ID=${input_project:-$PROJECT_ID}

read -p "Enter Region [us-central1]: " input_region
REGION=${input_region:-us-central1}

read -p "Enter MongoDB URL: " MONGO_URL
read -p "Enter Gemini API Key: " GEMINI_API_KEY

echo ""
echo "📝 Configuration:"
echo "   Project ID: $PROJECT_ID"
echo "   Region: $REGION"
echo "   MongoDB: ${MONGO_URL:0:30}..."
echo ""

read -p "Continue with deployment? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Deployment cancelled."
    exit 0
fi

# Set project
gcloud config set project $PROJECT_ID

# Build and push backend
echo ""
echo "🔨 Building backend..."
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/portfolio-backend

echo ""
echo "🚀 Deploying backend..."
gcloud run deploy portfolio-backend \
  --image gcr.io/$PROJECT_ID/portfolio-backend \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars MONGO_URL="$MONGO_URL",DATABASE_NAME=portfolio_db,PYTHONUNBUFFERED=1

# Get backend URL
BACKEND_URL=$(gcloud run services describe portfolio-backend --region $REGION --format 'value(status.url)')
echo "✅ Backend deployed: $BACKEND_URL"

# Build and push frontend
echo ""
echo "🔨 Building frontend..."
cd ../frontend
gcloud builds submit --tag gcr.io/$PROJECT_ID/portfolio-frontend \
  --build-arg GEMINI_API_KEY="$GEMINI_API_KEY"

echo ""
echo "🚀 Deploying frontend..."
gcloud run deploy portfolio-frontend \
  --image gcr.io/$PROJECT_ID/portfolio-frontend \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 256Mi \
  --cpu 1 \
  --max-instances 10 \
  --port 80 \
  --set-env-vars REACT_APP_API_URL=$BACKEND_URL/api,REACT_APP_BACKEND_URL=$BACKEND_URL,REACT_APP_GEMINI_API_KEY="$GEMINI_API_KEY"

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe portfolio-frontend --region $REGION --format 'value(status.url)')

echo ""
echo "=================================================="
echo "✅ Deployment Complete!"
echo "=================================================="
echo ""
echo "🌐 URLs:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  $BACKEND_URL"
echo "   API Docs: $BACKEND_URL/docs"
echo ""
echo "🔧 Next Steps:"
echo "   1. Test the deployment: curl $BACKEND_URL/api/health"
echo "   2. Migrate data: python ../migrate_data.py"
echo "   3. Configure custom domain: gcloud run domain-mappings create --service portfolio-frontend --domain khalilpreview.space --region $REGION"
echo ""
