#!/bin/bash

# 🔧 اسکریپت Fix کامل VPS

echo "🛑 Stopping old apps..."
pm2 delete hamraman 2>/dev/null || true
pm2 delete hamrabazar 2>/dev/null || true

echo "🗄️ Fixing database permissions..."
sudo -u postgres psql << 'EOF'
DROP DATABASE IF EXISTS hamraman;
DROP USER IF EXISTS hamraman_user;
CREATE DATABASE hamraman;
CREATE USER hamraman_user WITH PASSWORD 'Hamra@2025!Strong';
ALTER DATABASE hamraman OWNER TO hamraman_user;
GRANT ALL PRIVILEGES ON DATABASE hamraman TO hamraman_user;
\c hamraman
GRANT ALL ON SCHEMA public TO hamraman_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO hamraman_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO hamraman_user;
\q
EOF

echo "📝 Updating .env file..."
cd /var/www/hamrabazar
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://hamraman_user:Hamra@2025!Strong@localhost:5432/hamraman"
SESSION_SECRET="hamrabazar_secret_key_2025_very_secure_random_string"
PORT=3001
ENVEOF

echo "🔄 Running migrations..."
npm run db:push

echo "📁 Creating uploads directory..."
mkdir -p /var/www/hamrabazar/public/uploads
chmod -R 755 /var/www/hamrabazar/public

echo "🚀 Starting app..."
pm2 start dist/index.js --name hamrabazar
pm2 save

echo "✅ Done! Check logs with: pm2 logs hamrabazar"
