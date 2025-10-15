@echo off
REM Setup Workload Identity Federation for GitHub Actions (Windows)
REM This script configures secure authentication without JSON keys

echo === Setting up Workload Identity Federation ===
echo.

REM Check if gcloud is installed
where gcloud >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install
    exit /b 1
)

REM Get project ID
for /f "tokens=*" %%i in ('gcloud config get-value project 2^>nul') do set PROJECT_ID=%%i
if "%PROJECT_ID%"=="" (
    echo Error: No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID
    exit /b 1
)

echo Project ID: %PROJECT_ID%
echo.

REM Prompt for GitHub details
set /p GITHUB_OWNER="Enter your GitHub username/organization: "
set /p GITHUB_REPO="Enter your GitHub repository name: "

echo.
echo Step 1: Creating Workload Identity Pool...
set POOL_NAME=github-pool
set POOL_ID=projects/%PROJECT_ID%/locations/global/workloadIdentityPools/%POOL_NAME%

gcloud iam workload-identity-pools describe %POOL_NAME% --location=global --project=%PROJECT_ID% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Pool already exists, skipping creation
) else (
    gcloud iam workload-identity-pools create %POOL_NAME% --location=global --display-name="GitHub Actions Pool" --project=%PROJECT_ID%
    echo [✓] Pool created
)

echo.
echo Step 2: Creating Workload Identity Provider...
set PROVIDER_NAME=github-provider

gcloud iam workload-identity-pools providers describe %PROVIDER_NAME% --workload-identity-pool=%POOL_NAME% --location=global --project=%PROJECT_ID% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Provider already exists, skipping creation
) else (
    gcloud iam workload-identity-pools providers create-oidc %PROVIDER_NAME% --workload-identity-pool=%POOL_NAME% --location=global --issuer-uri="https://token.actions.githubusercontent.com" --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" --attribute-condition="assertion.repository_owner == '%GITHUB_OWNER%'" --project=%PROJECT_ID%
    echo [✓] Provider created
)

echo.
echo Step 3: Getting Service Account...
set SERVICE_ACCOUNT=github-actions-sa@%PROJECT_ID%.iam.gserviceaccount.com

gcloud iam service-accounts describe %SERVICE_ACCOUNT% --project=%PROJECT_ID% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Service account exists: %SERVICE_ACCOUNT%
) else (
    echo Creating service account...
    gcloud iam service-accounts create github-actions-sa --display-name="GitHub Actions Service Account" --project=%PROJECT_ID%
    
    REM Grant roles
    gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:%SERVICE_ACCOUNT%" --role="roles/run.admin"
    gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:%SERVICE_ACCOUNT%" --role="roles/storage.admin"
    gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:%SERVICE_ACCOUNT%" --role="roles/iam.serviceAccountUser"
    echo [✓] Service account created
)

echo.
echo Step 4: Waiting for Workload Identity Pool to be ready...
timeout /t 10 /nobreak >nul
echo [✓] Pool is ready

echo.
echo Step 5: Binding Workload Identity to Service Account...
gcloud iam service-accounts add-iam-policy-binding %SERVICE_ACCOUNT% --role="roles/iam.workloadIdentityUser" --member="principalSet://iam.googleapis.com/%POOL_ID%/attribute.repository/%GITHUB_OWNER%/%GITHUB_REPO%" --project=%PROJECT_ID%
echo [✓] Binding complete

echo.
echo Step 6: Getting Workload Identity Provider ID...
for /f "tokens=*" %%i in ('gcloud iam workload-identity-pools providers describe %PROVIDER_NAME% --workload-identity-pool=%POOL_NAME% --location=global --project=%PROJECT_ID% --format="value(name)"') do set WIF_PROVIDER=%%i
echo [✓] Configuration complete!

echo.
echo ============================================================
echo Add these secrets to your GitHub repository:
echo ============================================================
echo.
echo GCP_PROJECT_ID:
echo %PROJECT_ID%
echo.
echo WIF_PROVIDER:
echo %WIF_PROVIDER%
echo.
echo WIF_SERVICE_ACCOUNT:
echo %SERVICE_ACCOUNT%
echo.
echo GEMINI_API_KEY:
echo YOUR_GEMINI_API_KEY_HERE
echo.
echo MONGO_URL:
echo YOUR_MONGODB_CONNECTION_STRING_HERE
echo.
echo ============================================================
echo.
echo How to add secrets to GitHub:
echo 1. Go to: https://github.com/%GITHUB_OWNER%/%GITHUB_REPO%/settings/secrets/actions
echo 2. Click 'New repository secret'
echo 3. Add each secret above
echo.
echo Done! Your GitHub Actions workflow can now deploy to Cloud Run.

pause
