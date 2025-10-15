@echo off
REM Complete Workload Identity Federation Setup
REM Run this after the pool and provider are already created

echo === Completing Workload Identity Federation Setup ===
echo.

set PROJECT_ID=zyniq-core
set GITHUB_OWNER=ZYNIQ-AI-Driven-Development-Firm
set GITHUB_REPO=Ibrahim-El-Khalil-Portfolio-new-version
set SERVICE_ACCOUNT=github-actions-sa@%PROJECT_ID%.iam.gserviceaccount.com
set POOL_ID=projects/%PROJECT_ID%/locations/global/workloadIdentityPools/github-pool

echo Waiting 15 seconds for pool to be fully ready...
timeout /t 15 /nobreak >nul
echo.

echo Binding Workload Identity to Service Account...
gcloud iam service-accounts add-iam-policy-binding %SERVICE_ACCOUNT% ^
    --role="roles/iam.workloadIdentityUser" ^
    --member="principalSet://iam.googleapis.com/%POOL_ID%/attribute.repository/%GITHUB_OWNER%/%GITHUB_REPO%" ^
    --project=%PROJECT_ID%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Binding failed. The pool might need more time to propagate.
    echo Please wait 2-3 minutes and try again.
    pause
    exit /b 1
)

echo [✓] Binding complete!
echo.

echo Getting Workload Identity Provider ID...
for /f "tokens=*" %%i in ('gcloud iam workload-identity-pools providers describe github-provider --workload-identity-pool=github-pool --location=global --project=%PROJECT_ID% --format="value(name)"') do set WIF_PROVIDER=%%i

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
echo Done! Ready to deploy!

pause
