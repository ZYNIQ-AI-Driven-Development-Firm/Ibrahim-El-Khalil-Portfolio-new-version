#!/bin/bash
# Deploy entire portfolio stack to Google Compute Engine VM using Docker Compose

set -e

echo "🚀 Portfolio - VM Deployment with Docker Compose"
echo "================================================"

# Configuration
read -p "Enter GCP Project ID: " PROJECT_ID
read -p "Enter VM name [portfolio-vm]: " VM_NAME
VM_NAME=${VM_NAME:-portfolio-vm}
read -p "Enter Zone [us-central1-a]: " ZONE
ZONE=${ZONE:-us-central1-a}
read -p "Enter Machine Type [e2-medium]: " MACHINE_TYPE
MACHINE_TYPE=${MACHINE_TYPE:-e2-medium}

gcloud config set project $PROJECT_ID

echo ""
echo "📝 Configuration:"
echo "   Project: $PROJECT_ID"
echo "   VM Name: $VM_NAME"
echo "   Zone: $ZONE"
echo "   Machine: $MACHINE_TYPE"
echo ""

read -p "Continue? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Cancelled."
    exit 0
fi

# Create VM
echo ""
echo "🔨 Creating VM instance..."
gcloud compute instances create $VM_NAME \
  --project=$PROJECT_ID \
  --zone=$ZONE \
  --machine-type=$MACHINE_TYPE \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB \
  --boot-disk-type=pd-standard \
  --tags=http-server,https-server \
  --metadata=startup-script='#!/bin/bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $USER

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Git
apt-get update
apt-get install -y git
'

# Create firewall rules
echo ""
echo "🔥 Creating firewall rules..."
gcloud compute firewall-rules create allow-portfolio \
  --project=$PROJECT_ID \
  --allow tcp:80,tcp:443,tcp:3000,tcp:8001,tcp:27017 \
  --target-tags=http-server \
  --description="Allow portfolio application traffic" \
  2>/dev/null || echo "Firewall rule already exists, skipping..."

# Wait for VM to be ready
echo ""
echo "⏳ Waiting for VM to be ready (60 seconds)..."
sleep 60

# Get VM IP
VM_IP=$(gcloud compute instances describe $VM_NAME --zone=$ZONE --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo ""
echo "✅ VM created at IP: $VM_IP"

# Connect and deploy
echo ""
echo "🚀 Deploying application..."

gcloud compute ssh $VM_NAME --zone=$ZONE --command="
set -e
echo '📦 Cloning repository...'
git clone https://github.com/ZYNIQ-AI-Driven-Development-Firm/Ibrahim-El-Khalil-Portfolio-new-version.git portfolio
cd portfolio

echo '🔧 Configuring environment...'
cat > .env << 'EOF'
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=portfolioPassword123
DATABASE_NAME=portfolio_db
BACKEND_PORT=8001
FRONTEND_PORT=3000
NODE_ENV=production
GEMINI_API_KEY=$GEMINI_API_KEY
REACT_APP_GEMINI_API_KEY=$GEMINI_API_KEY
REACT_APP_BACKEND_URL=http://$VM_IP:8001
REACT_APP_API_URL=http://$VM_IP:8001/api
EOF

echo '🐳 Starting Docker containers...'
sudo docker-compose up -d

echo '⏳ Waiting for services to start...'
sleep 30

echo '✅ Checking service status...'
sudo docker-compose ps

echo '📊 Viewing logs...'
sudo docker-compose logs --tail=20
"

echo ""
echo "================================================"
echo "✅ Deployment Complete!"
echo "================================================"
echo ""
echo "🌐 Access your portfolio:"
echo "   Frontend: http://$VM_IP:3000"
echo "   Backend:  http://$VM_IP:8001"
echo "   API Docs: http://$VM_IP:8001/docs"
echo "   Admin:    http://$VM_IP:3000/admin"
echo ""
echo "🔧 Manage your VM:"
echo "   SSH: gcloud compute ssh $VM_NAME --zone=$ZONE"
echo "   Logs: gcloud compute ssh $VM_NAME --zone=$ZONE --command='cd portfolio && sudo docker-compose logs -f'"
echo "   Stop: gcloud compute ssh $VM_NAME --zone=$ZONE --command='cd portfolio && sudo docker-compose stop'"
echo "   Start: gcloud compute ssh $VM_NAME --zone=$ZONE --command='cd portfolio && sudo docker-compose start'"
echo ""
echo "🌍 Map your domain:"
echo "   At your domain registrar, add:"
echo "   A Record: @ -> $VM_IP"
echo "   A Record: www -> $VM_IP"
echo ""
echo "📊 Estimated cost: ~\$15-25/month"
echo ""
