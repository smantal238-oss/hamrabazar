#!/bin/bash

# 🌐 اسکریپت Setup Nginx و SSL

echo "📦 Installing Nginx..."
apt install nginx -y

echo "🔧 Configuring Nginx..."
cat > /etc/nginx/sites-available/hamrabazar << 'EOF'
server {
    listen 80;
    server_name hamrabazar.com www.hamrabazar.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        alias /var/www/hamrabazar/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -sf /etc/nginx/sites-available/hamrabazar /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

echo "✅ Testing Nginx config..."
nginx -t

echo "🔄 Restarting Nginx..."
systemctl restart nginx
systemctl enable nginx

echo "🔒 Installing Certbot for SSL..."
apt install certbot python3-certbot-nginx -y

echo "📜 Getting SSL certificate..."
certbot --nginx -d hamrabazar.com -d www.hamrabazar.com --non-interactive --agree-tos --email admin@hamrabazar.com

echo "✅ Setup complete! Visit https://hamrabazar.com"
