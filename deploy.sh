#!/bin/bash
set -e

echo "============================================"
echo "  SolarIQ - VPS Production Deployment"
echo "============================================"
echo ""

REPO_DIR="/opt/solariq"

# Install Docker if missing
if ! command -v docker &> /dev/null; then
    echo "[1/4] Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker "$USER"
fi

# Clone or pull
if [ -d "$REPO_DIR" ]; then
    echo "[2/4] Updating code..."
    cd "$REPO_DIR"
    git pull
else
    echo "[2/4] Cloning repository..."
    git clone <YOUR_GIT_REPO_URL> "$REPO_DIR"
    cd "$REPO_DIR"
fi

# Build frontend
echo "[3/4] Building frontend..."
cd frontend
npm ci --silent
npm run build
cd ..

# Build and start Docker
echo "[4/4] Starting containers..."
docker compose -f docker-compose.vps.yml up -d --build

echo ""
echo "============================================"
echo "  SolarIQ is LIVE!"
echo "  URL: http://$(curl -s ifconfig.me)"
echo "============================================"
