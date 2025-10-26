# راهنمای نصب در VPS

## قدم 1: آپلود فایل ها

فایل های این پوشه را در VPS آپلود کنید:

```bash
# در VPS:
cd /path/to/your/project

# کپی فایل ها
cp google-credentials.json ./
cp .env.example .env
cp server/email.ts server/
cp server/passport-config.ts server/
cp server/routes-updated.ts server/routes.ts
cp client/src/pages/AuthPage-updated.tsx client/src/pages/AuthPage.tsx
```

## قدم 2: ویرایش .env

```bash
nano .env
```

مقادیر را با اطلاعات واقعی خود جایگزین کنید:

```env
GOOGLE_CLIENT_ID=از فایل google-credentials.json
GOOGLE_CLIENT_SECRET=از فایل google-credentials.json
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abhbnwgkawzzcwwy
```

## قدم 3: نصب پکیج ها

```bash
npm install passport passport-google-oauth20 nodemailer
```

## قدم 4: ری استارت

```bash
pm2 restart all
```

## تست:

1. به `https://your-domain.com/auth` بروید
2. دکمه "ورود با Google" را ببینید
3. تست کنید!
