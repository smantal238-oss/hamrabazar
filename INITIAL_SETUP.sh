#!/bin/bash

# 🔧 Setup اولیه VPS (فقط یکبار اجرا شود)

echo "🔧 Setting up VPS for first time..."
ssh root@31.97.73.248 << 'ENDSSH'
cd /var/www
git clone https://github.com/smantal238-oss/hamrabazar.git
cd hamrabazar
npm install
npm run build
npm run db:push
pm2 start dist/index.js --name hamrabazar
pm2 save
pm2 startup
ENDSSH

echo "✅ Initial setup complete!"
