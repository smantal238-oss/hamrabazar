#!/bin/bash

# 🚀 اسکریپت کامل Setup VPS

echo "📦 Installing PostgreSQL..."
apt update
apt install postgresql postgresql-contrib -y
systemctl start postgresql
systemctl enable postgresql

echo "🗄️ Creating database and user..."
sudo -u postgres psql << EOF
CREATE DATABASE hamraman;
CREATE USER hamraman_user WITH PASSWORD 'Hamra@2025!Strong';
GRANT ALL PRIVILEGES ON DATABASE hamraman TO hamraman_user;
ALTER DATABASE hamraman OWNER TO hamraman_user;
\q
EOF

echo "📝 Creating .env file..."
cd /var/www/hamrabazar
cat > .env << 'EOF'
DATABASE_URL="postgresql://hamraman_user:Hamra@2025!Strong@localhost:5432/hamraman"
SESSION_SECRET="hamrabazar_secret_key_2025_very_secure_random_string"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
EOF

echo "🔄 Running database migrations..."
npm run db:push

echo "🔄 Restarting PM2..."
pm2 restart hamrabazar

echo "✅ Setup complete! Check status with: pm2 status"
