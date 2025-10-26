// این کدها را به ابتدای فایل server/routes.ts اضافه کنید:

import passport from 'passport';
import { setupPassport } from './passport-config';
import { EmailService } from './email';

// بعد از تعریف limiter، این خط را اضافه کنید:
setupPassport();

// این route ها را بعد از app.use(limiter) اضافه کنید:

// Google OAuth routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth' }),
  (req: any, res) => {
    const user = req.user;
    // ارسال اطلاعات کاربر به frontend
    res.redirect(`/auth?googleAuth=success&user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);

// Send verification code to email
app.post("/api/auth/send-email-code", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: "ایمیل معتبر نیست" });
    }
    
    const { mockUsers } = await import("./mockData");
    const existingUser = mockUsers.find(u => u.email === email || u.phone === email);
    
    // Generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);
    
    // Store code
    global.emailCodes = global.emailCodes || {};
    global.emailCodes[email] = { 
      code, 
      expiry,
      isNewUser: !existingUser
    };
    
    // Send email
    const emailService = EmailService.getInstance();
    const sent = await emailService.sendVerificationCode(email, code);
    
    if (!sent) {
      return res.status(500).json({ message: "خطا در ارسال ایمیل" });
    }
    
    console.log(`📧 Verification code sent to ${email}: ${code}`);
    
    res.json({ 
      success: true, 
      message: "کد تایید به ایمیل شما ارسال شد",
      isNewUser: !existingUser
    });
  } catch (error: any) {
    console.error('Send email code error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify email code and login/register
app.post("/api/auth/verify-email-code", async (req, res) => {
  try {
    const { email, code, name, password } = req.body;
    
    const storedCode = global.emailCodes?.[email];
    if (!storedCode || storedCode.expiry < new Date()) {
      return res.status(401).json({ message: "کد منقضی شده یا نامعتبر است" });
    }
    
    if (storedCode.code !== code) {
      return res.status(401).json({ message: "کد تایید نادرست است" });
    }
    
    const { mockUsers } = await import("./mockData");
    let user = mockUsers.find(u => u.email === email || u.phone === email);
    
    if (!user && storedCode.isNewUser) {
      // Create new user
      user = {
        id: 'user_' + Date.now(),
        name: name || 'کاربر',
        email: email,
        phone: email,
        password: password || '',
        role: 'user',
        createdAt: new Date()
      };
      mockUsers.push(user);
      console.log(`🎉 New user via email: ${user.name} (${email})`);
    }
    
    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }
    
    // Clear code
    delete global.emailCodes[email];
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      user: userWithoutPassword,
      message: storedCode.isNewUser ? 'ثبت نام موفق' : 'ورود موفق'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot password - send reset code
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: "ایمیل معتبر نیست" });
    }
    
    const { mockUsers } = await import("./mockData");
    const user = mockUsers.find(u => u.email === email || u.phone === email);
    
    if (!user) {
      return res.status(404).json({ message: "کاربری با این ایمیل یافت نشد" });
    }
    
    // Generate reset code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);
    
    // Store code
    global.resetCodes = global.resetCodes || {};
    global.resetCodes[email] = { code, expiry };
    
    // Send email
    const emailService = EmailService.getInstance();
    const sent = await emailService.sendPasswordReset(email, code);
    
    if (!sent) {
      return res.status(500).json({ message: "خطا در ارسال ایمیل" });
    }
    
    console.log(`🔑 Password reset code sent to ${email}: ${code}`);
    
    res.json({ 
      success: true, 
      message: "کد بازیابی به ایمیل شما ارسال شد"
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Reset password with code
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    const storedCode = global.resetCodes?.[email];
    if (!storedCode || storedCode.expiry < new Date()) {
      return res.status(401).json({ message: "کد منقضی شده یا نامعتبر است" });
    }
    
    if (storedCode.code !== code) {
      return res.status(401).json({ message: "کد تایید نادرست است" });
    }
    
    const { mockUsers } = await import("./mockData");
    const user = mockUsers.find(u => u.email === email || u.phone === email);
    
    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }
    
    // Update password
    user.password = newPassword;
    
    // Clear code
    delete global.resetCodes[email];
    
    console.log(`✅ Password reset for ${email}`);
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      user: userWithoutPassword,
      message: "رمز عبور با موفقیت تغییر کرد"
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
