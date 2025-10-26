# راهنمای اضافه کردن ادمین بدون احراز دو مرحله‌ای

## مرحله 1: اتصال به VPS

```bash
ssh user@your-vps-ip
cd /path/to/your/project
```

## مرحله 2: ویرایش فایل mockData.ts

```bash
nano server/mockData.ts
```

یا

```bash
vim server/mockData.ts
```

## مرحله 3: اضافه کردن ادمین

در قسمت `export const mockUsers` این خط را اضافه کنید:

```javascript
{ id: "admin3", name: "BasirSultani", phone: "BasirSultani", password: "basir123", role: "admin", createdAt: new Date() },
```

**مثال کامل:**

```javascript
export const mockUsers = [
  { id: "admin", name: "ادمین", phone: "+93700000000", password: "admin123", role: "admin", createdAt: new Date() },
  { id: "admin2", name: "ادمین جدید", phone: "+93700000001", password: "123456", role: "admin", createdAt: new Date() },
  { id: "admin3", name: "BasirSultani", phone: "BasirSultani", password: "basir123", role: "admin", createdAt: new Date() },
  // بقیه کاربران...
];
```

## مرحله 4: ذخیره و خروج

- در nano: `Ctrl+X` سپس `Y` سپس `Enter`
- در vim: `ESC` سپس `:wq` سپس `Enter`

## مرحله 5: ری استارت سرویس

```bash
# اگر از PM2 استفاده میکنید:
pm2 restart all

# یا اگر از systemd استفاده میکنید:
sudo systemctl restart your-app-name

# یا اگر مستقیم اجرا میکنید:
pkill -f "node"
npm run start
```

## مرحله 6: تست ورود

1. به وبسایت خود بروید: `https://your-domain.com/auth`
2. تب "ورود" را انتخاب کنید
3. شماره تلفن: `BasirSultani`
4. رمز عبور: `basir123`
5. روی "ورود" کلیک کنید

## نکات مهم:

- ✅ فقط یک خط اضافه میکنید
- ✅ هیچ داده دیگری تغییر نمیکند
- ✅ بدون نیاز به احراز دو مرحله‌ای
- ✅ مستقیماً به پنل ادمین دسترسی دارید

## امنیت:

برای امنیت بیشتر، رمز عبور قوی‌تر انتخاب کنید:

```javascript
{ id: "admin3", name: "BasirSultani", phone: "BasirSultani", password: "YourStrongPassword@123", role: "admin", createdAt: new Date() },
```
