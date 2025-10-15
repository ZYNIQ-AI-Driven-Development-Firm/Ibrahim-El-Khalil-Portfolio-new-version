#!/bin/bash
# Docker Portfolio Startup Script

echo "🚀 Starting Ibrahim El Khalil Portfolio Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Please review and update the .env file with your settings"
fi

# Production or Development mode
MODE=${1:-prod}

if [ "$MODE" = "dev" ]; then
    echo "🔧 Starting in DEVELOPMENT mode..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up -d --build
    
    echo ""
    echo "🌐 Development Environment Ready!"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8001"
    echo "API Docs: http://localhost:8001/docs"
    echo "Database Admin: http://localhost:8081 (admin/admin)"
    echo ""
    echo "📊 Logs: docker-compose -f docker-compose.dev.yml logs -f"
else
    echo "🏭 Starting in PRODUCTION mode..."
    docker-compose down
    docker-compose up -d --build
    
    echo ""
    echo "🌐 Production Environment Ready!"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8001"
    echo "API Docs: http://localhost:8001/docs"
    echo ""
    echo "📊 Logs: docker-compose logs -f"
fi

echo "🎉 Portfolio application is starting up..."
echo "⏳ Please wait a moment for all services to be ready."