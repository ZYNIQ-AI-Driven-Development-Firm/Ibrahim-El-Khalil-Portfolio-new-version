@echo off
REM Quick Deploy Script for Google Cloud Run (Windows)

echo 🚀 Ibrahim Portfolio - Cloud Run Deployment Script
echo ==================================================

REM Check if gcloud is installed
where gcloud >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ gcloud CLI not found. Please install it first:
    echo    https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

REM Prompt for required variables
set /p PROJECT_ID="Enter GCP Project ID: "
set /p REGION="Enter Region [us-central1]: "
if "%REGION%"=="" set REGION=us-central1

set /p MONGO_URL="Enter MongoDB URL: "
set /p GEMINI_API_KEY="Enter Gemini API Key: "

echo.
echo 📝 Configuration:
echo    Project ID: %PROJECT_ID%
echo    Region: %REGION%
echo.

set /p CONFIRM="Continue with deployment? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo Deployment cancelled.
    pause
    exit /b 0
)

REM Set project
gcloud config set project %PROJECT_ID%

REM Build and push backend
echo.
echo 🔨 Building backend...
cd backend
gcloud builds submit --tag gcr.io/%PROJECT_ID%/portfolio-backend

echo.
echo 🚀 Deploying backend...
gcloud run deploy portfolio-backend ^
  --image gcr.io/%PROJECT_ID%/portfolio-backend ^
  --region %REGION% ^
  --platform managed ^
  --allow-unauthenticated ^
  --memory 512Mi ^
  --cpu 1 ^
  --max-instances 10 ^
  --set-env-vars MONGO_URL=%MONGO_URL%,DATABASE_NAME=portfolio_db,PYTHONUNBUFFERED=1

REM Get backend URL
for /f "delims=" %%i in ('gcloud run services describe portfolio-backend --region %REGION% --format "value(status.url)"') do set BACKEND_URL=%%i
echo ✅ Backend deployed: %BACKEND_URL%

REM Build and push frontend
echo.
echo 🔨 Building frontend...
cd ..\frontend
gcloud builds submit --tag gcr.io/%PROJECT_ID%/portfolio-frontend ^
  --build-arg GEMINI_API_KEY=%GEMINI_API_KEY%

echo.
echo 🚀 Deploying frontend...
gcloud run deploy portfolio-frontend ^
  --image gcr.io/%PROJECT_ID%/portfolio-frontend ^
  --region %REGION% ^
  --platform managed ^
  --allow-unauthenticated ^
  --memory 256Mi ^
  --cpu 1 ^
  --max-instances 10 ^
  --port 80 ^
  --set-env-vars REACT_APP_API_URL=%BACKEND_URL%/api,REACT_APP_BACKEND_URL=%BACKEND_URL%,REACT_APP_GEMINI_API_KEY=%GEMINI_API_KEY%

REM Get frontend URL
for /f "delims=" %%i in ('gcloud run services describe portfolio-frontend --region %REGION% --format "value(status.url)"') do set FRONTEND_URL=%%i

echo.
echo ==================================================
echo ✅ Deployment Complete!
echo ==================================================
echo.
echo 🌐 URLs:
echo    Frontend: %FRONTEND_URL%
echo    Backend:  %BACKEND_URL%
echo    API Docs: %BACKEND_URL%/docs
echo.
echo 🔧 Next Steps:
echo    1. Test the deployment
echo    2. Migrate data: python ..\migrate_data.py
echo    3. Configure custom domain
echo.
pause
