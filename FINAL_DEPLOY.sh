#!/bin/bash

# 🚀 اسکریپت نهایی Deploy با Git

echo "📝 Committing changes..."
git add .
git commit -m "Deploy: $(date +%Y-%m-%d_%H:%M:%S)"

echo "⬆️ Pushing to GitHub..."
git push origin main

echo "🚀 Deploying to VPS..."
ssh root@31.97.73.248 << 'ENDSSH'
cd /var/www/hamrabazar
git pull origin main
npm install
npm run build
npm run db:push
pm2 restart hamrabazar || pm2 start dist/index.js --name hamrabazar
pm2 save
ENDSSH

echo "✅ Deployment complete!"
