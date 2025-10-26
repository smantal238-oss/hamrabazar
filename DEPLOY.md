# 🚀 راهنمای Deploy روی VPS

## 1️⃣ آماده‌سازی فایل‌ها

```bash
cd /home/hajimantal/Desktop/websitedata/final/ready/hamraman
npm run build
tar -czf hamraman-deploy.tar.gz dist/ public/ package.json package-lock.json .env drizzle.config.ts
```

## 2️⃣ انتقال به VPS

```bash
scp hamraman-deploy.tar.gz root@31.97.73.248:/root/
```

## 3️⃣ نصب روی VPS

```bash
ssh root@31.97.73.248

# Extract files
cd /root
tar -xzf hamraman-deploy.tar.gz -C /var/www/hamrabazar/

# Install dependencies
cd /var/www/hamrabazar
npm install --production

# Setup database
npm install -g drizzle-kit
drizzle-kit push

# Setup PM2
npm install -g pm2
pm2 start dist/index.js --name hamrabazar
pm2 save
pm2 startup
```

## 4️⃣ تنظیمات Nginx

```nginx
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
    }

    location /uploads {
        alias /var/www/hamrabazar/public/uploads;
    }
}
```

## 5️⃣ تنظیمات .env روی VPS

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hamraman"
NODE_ENV=production
GOOGLE_CLIENT_ID=733408298459-pbu0fmcv51bn03k46sb55uk87t464gbu.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://hamrabazar.com/api/auth/google/callback
GMAIL_USER=coomingsoon1404@gmail.com
GMAIL_APP_PASSWORD=abhbnwgkawzzcwwy
```

## 6️⃣ دستورات مفید

```bash
# مشاهده لاگ‌ها
pm2 logs hamrabazar

# Restart
pm2 restart hamrabazar

# Stop
pm2 stop hamrabazar

# Status
pm2 status

# Backup دیتابیس
pg_dump -U postgres hamraman > backup_$(date +%Y%m%d).sql

# Restore دیتابیس
psql -U postgres hamraman < backup_20250126.sql
```

## ✅ چک‌لیست نهایی

- [ ] PostgreSQL نصب و راه‌اندازی شده
- [ ] Node.js v18+ نصب شده
- [ ] Nginx نصب و تنظیم شده
- [ ] SSL Certificate نصب شده (Let's Encrypt)
- [ ] Firewall تنظیم شده (پورت 80, 443, 22)
- [ ] PM2 راه‌اندازی شده
- [ ] Backup خودکار تنظیم شده
- [ ] Domain به IP سرور متصل شده

## 🔒 امنیت

```bash
# تغییر پسورد PostgreSQL
sudo -u postgres psql
ALTER USER postgres PASSWORD 'STRONG_PASSWORD';

# Firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable

# Fail2ban
apt install fail2ban
systemctl enable fail2ban
```
