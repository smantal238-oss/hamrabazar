#!/bin/bash

# 🚀 اسکریپت کامل Deploy - همه چی یکجا

echo "📦 Building project locally..."
npm run build

echo "📁 Creating deployment package..."
tar -czf deploy.tar.gz \
  dist/ \
  public/ \
  package.json \
  package-lock.json \
  drizzle.config.ts

echo "📤 Uploading to VPS..."
scp deploy.tar.gz root@31.97.73.248:/root/

echo "🚀 Deploying on VPS..."
ssh root@31.97.73.248 << 'ENDSSH'

# Extract files
cd /var/www/hamrabazar
tar -xzf /root/deploy.tar.gz
rm /root/deploy.tar.gz

# Install dependencies
npm install --production

# Create .env if not exists
if [ ! -f .env ]; then
cat > .env << 'EOF'
DATABASE_URL="postgresql://hamraman_user:Hamra@2025!Strong@localhost:5432/hamraman"
SESSION_SECRET="hamrabazar_secret_key_2025_very_secure_random_string"
PORT=3001
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
EOF
fi

# Create uploads directory
mkdir -p public/uploads
chmod -R 755 public

# Run migrations
npm run db:push

# Restart PM2
pm2 delete hamraman 2>/dev/null || true
pm2 start dist/index.js --name hamraman
pm2 save

echo "✅ Deployment complete!"
pm2 status

ENDSSH

echo "🎉 Done! Your site is live!"
