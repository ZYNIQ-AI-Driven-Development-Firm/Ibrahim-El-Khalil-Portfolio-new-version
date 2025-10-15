@echo off
REM Deploy entire portfolio stack to Google Compute Engine VM using Docker Compose

echo 🚀 Portfolio - VM Deployment with Docker Compose
echo ================================================

REM Configuration
set /p PROJECT_ID="Enter GCP Project ID: "
set /p VM_NAME="Enter VM name [portfolio-vm]: "
if "%VM_NAME%"=="" set VM_NAME=portfolio-vm

set /p ZONE="Enter Zone [us-central1-a]: "
if "%ZONE%"=="" set ZONE=us-central1-a

set /p MACHINE_TYPE="Enter Machine Type [e2-medium]: "
if "%MACHINE_TYPE%"=="" set MACHINE_TYPE=e2-medium

gcloud config set project %PROJECT_ID%

echo.
echo 📝 Configuration:
echo    Project: %PROJECT_ID%
echo    VM Name: %VM_NAME%
echo    Zone: %ZONE%
echo    Machine: %MACHINE_TYPE%
echo.

set /p CONFIRM="Continue? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo Cancelled.
    pause
    exit /b 0
)

REM Create VM
echo.
echo 🔨 Creating VM instance...
gcloud compute instances create %VM_NAME% ^
  --project=%PROJECT_ID% ^
  --zone=%ZONE% ^
  --machine-type=%MACHINE_TYPE% ^
  --image-family=ubuntu-2004-lts ^
  --image-project=ubuntu-os-cloud ^
  --boot-disk-size=20GB ^
  --boot-disk-type=pd-standard ^
  --tags=http-server,https-server ^
  --metadata=startup-script="#!/bin/bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $USER
curl -L \"https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
apt-get update && apt-get install -y git
"

REM Create firewall rules
echo.
echo 🔥 Creating firewall rules...
gcloud compute firewall-rules create allow-portfolio ^
  --project=%PROJECT_ID% ^
  --allow tcp:80,tcp:443,tcp:3000,tcp:8001,tcp:27017 ^
  --target-tags=http-server ^
  --description="Allow portfolio application traffic" 2>nul || echo Firewall rule already exists, skipping...

REM Wait for VM to be ready
echo.
echo ⏳ Waiting for VM to be ready (60 seconds)...
timeout /t 60 /nobreak >nul

REM Get VM IP
for /f "delims=" %%i in ('gcloud compute instances describe %VM_NAME% --zone=%ZONE% --format="get(networkInterfaces[0].accessConfigs[0].natIP)"') do set VM_IP=%%i

echo.
echo ✅ VM created at IP: %VM_IP%

REM Connect and deploy
echo.
echo 🚀 Deploying application...

gcloud compute ssh %VM_NAME% --zone=%ZONE% --command="
git clone https://github.com/ZYNIQ-AI-Driven-Development-Firm/Ibrahim-El-Khalil-Portfolio-new-version.git portfolio
cd portfolio
cat > .env << 'EOF'
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=portfolioPassword123
DATABASE_NAME=portfolio_db
BACKEND_PORT=8001
FRONTEND_PORT=3000
NODE_ENV=production
GEMINI_API_KEY=%GEMINI_API_KEY%
REACT_APP_GEMINI_API_KEY=%GEMINI_API_KEY%
REACT_APP_BACKEND_URL=http://%VM_IP%:8001
REACT_APP_API_URL=http://%VM_IP%:8001/api
EOF
sudo docker-compose up -d
sleep 30
sudo docker-compose ps
"

echo.
echo ================================================
echo ✅ Deployment Complete!
echo ================================================
echo.
echo 🌐 Access your portfolio:
echo    Frontend: http://%VM_IP%:3000
echo    Backend:  http://%VM_IP%:8001
echo    API Docs: http://%VM_IP%:8001/docs
echo    Admin:    http://%VM_IP%:3000/admin
echo.
echo 🔧 Manage your VM:
echo    SSH: gcloud compute ssh %VM_NAME% --zone=%ZONE%
echo.
echo 🌍 Map your domain:
echo    At your domain registrar, add:
echo    A Record: @ -^> %VM_IP%
echo    A Record: www -^> %VM_IP%
echo.
echo 📊 Estimated cost: ~$15-25/month
echo.
pause
