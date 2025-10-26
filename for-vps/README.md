# راهنمای کامل نصب ورود با Gmail

## فایل های این پوشه:

1. **INSTALL.md** - راهنمای نصب قدم به قدم
2. **.env.example** - نمونه فایل تنظیمات
3. **email.ts** - سرویس ارسال ایمیل
4. **passport-config.ts** - تنظیمات Google OAuth
5. **routes-additions.ts** - route های جدید
6. **mockData-updated.ts** - داده های بهروزرسانی شده
7. **google-credentials.json** - فایل JSON شما (خودتان اضافه کنید)

## مراحل نصب در VPS:

### 1. آپلود فایل ها

```bash
# در VPS:
cd /path/to/your/project

# کپی فایل ها
cp for-vps/email.ts server/
cp for-vps/passport-config.ts server/
cp for-vps/mockData-updated.ts server/mockData.ts
cp for-vps/google-credentials.json ./
```

### 2. ویرایش server/routes.ts

فایل `server/routes.ts` را باز کنید:

```bash
nano server/routes.ts
```

**در ابتدای فایل** (بعد از import ها):

```typescript
import passport from 'passport';
import { setupPassport } from './passport-config';
import { EmailService } from './email';
```

**بعد از `export async function registerRoutes`** و **بعد از `app.use(limiter);`**:

```typescript
setupPassport();
```

**سپس تمام محتوای فایل `routes-additions.ts` را کپی کنید و بعد از `app.use(limiter);` بگذارید**

### 3. ویرایش .env

```bash
nano .env
```

اضافه کنید:

```env
# Google OAuth
GOOGLE_CLIENT_ID=از فایل google-credentials.json
GOOGLE_CLIENT_SECRET=از فایل google-credentials.json  
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback

# Gmail
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abhbnwgkawzzcwwy
```

### 4. نصب پکیج ها

```bash
npm install passport passport-google-oauth20 nodemailer
```

### 5. ری استارت

```bash
pm2 restart all
```

## تست:

1. به `https://your-domain.com/auth` بروید
2. باید دکمه "ورود با Google" را ببینید
3. کلیک کنید و تست کنید!

## ویژگی های جدید:

✅ ورود با Google (یک کلیک)
✅ ورود با Gmail + رمز
✅ ثبت نام با Gmail
✅ فراموشی رمز عبور
✅ ارسال کد تایید به Gmail
✅ بازیابی رمز عبور

## پشتیبانی:

اگر مشکلی داشتید:

```bash
# لاگ های سرور را ببینید:
pm2 logs

# یا
tail -f /var/log/your-app.log
```
