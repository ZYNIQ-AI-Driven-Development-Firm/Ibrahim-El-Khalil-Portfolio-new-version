@echo off
REM Docker Portfolio Startup Script for Windows

echo 🚀 Starting Ibrahim El Khalil Portfolio Application...

REM Check if Docker is running
docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check for .env file
if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ Please review and update the .env file with your settings
)

REM Production or Development mode
set MODE=%1
if "%MODE%"=="" set MODE=prod

if "%MODE%"=="dev" (
    echo 🔧 Starting in DEVELOPMENT mode...
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up -d --build
    
    echo.
    echo 🌐 Development Environment Ready!
    echo Frontend: http://localhost:3000
    echo Backend API: http://localhost:8001
    echo API Docs: http://localhost:8001/docs
    echo Database Admin: http://localhost:8081 (admin/admin^)
    echo.
    echo 📊 Logs: docker-compose -f docker-compose.dev.yml logs -f
) else (
    echo 🏭 Starting in PRODUCTION mode...
    docker-compose down
    docker-compose up -d --build
    
    echo.
    echo 🌐 Production Environment Ready!
    echo Frontend: http://localhost:3000
    echo Backend API: http://localhost:8001
    echo API Docs: http://localhost:8001/docs
    echo.
    echo 📊 Logs: docker-compose logs -f
)

echo 🎉 Portfolio application is starting up...
echo ⏳ Please wait a moment for all services to be ready.
pause