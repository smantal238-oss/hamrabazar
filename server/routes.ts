import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertListingSchema, insertUserSchema, insertMessageSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { FileManager } from "./fileManager";
import rateLimit from "express-rate-limit";
import { SMSService } from "./sms";
import passport from 'passport';
import { setupPassport } from './passport-config';
import { EmailService } from './email';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileManager = new FileManager();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../public/uploads');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
      cb(null, uniqueSuffix + '_' + sanitizedName);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(limiter);
  setupPassport();
  
  // Test endpoint
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working", timestamp: new Date() });
  });
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, phone, password } = req.body;
      const { mockUsers } = await import("./mockData");

      const existingUser = mockUsers.find(u => u.phone === phone);
      if (existingUser) {
        return res.status(400).json({ message: "شماره تلفن قبلاً ثبت شده است" });
      }

      const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        phone: phone,
        password: password,
        role: 'user',
        createdAt: new Date()
      };

      mockUsers.push(newUser);
      console.log(`✅ New user registered: ${name} (${phone})`);

      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Google OAuth routes
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/auth' }),
    (req: any, res) => {
      const user = req.user;
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
      
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);
      
      global.emailCodes = global.emailCodes || {};
      global.emailCodes[email] = { code, expiry, isNewUser: !existingUser };
      
      const emailService = EmailService.getInstance();
      const sent = await emailService.sendVerificationCode(email, code);
      
      if (!sent) {
        return res.status(500).json({ message: "خطا در ارسال ایمیل" });
      }
      
      console.log(`📧 Verification code sent to ${email}: ${code}`);
      
      res.json({ success: true, message: "کد تایید به ایمیل شما ارسال شد", isNewUser: !existingUser });
    } catch (error: any) {
      console.error('Send email code error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Verify email code
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
      
      delete global.emailCodes[email];
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, message: storedCode.isNewUser ? 'ثبت نام موفق' : 'ورود موفق' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Forgot password
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
      
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);
      
      global.resetCodes = global.resetCodes || {};
      global.resetCodes[email] = { code, expiry };
      
      const emailService = EmailService.getInstance();
      const sent = await emailService.sendPasswordReset(email, code);
      
      if (!sent) {
        return res.status(500).json({ message: "خطا در ارسال ایمیل" });
      }
      
      console.log(`🔑 Password reset code sent to ${email}: ${code}`);
      
      res.json({ success: true, message: "کد بازیابی به ایمیل شما ارسال شد" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Reset password
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
      
      user.password = newPassword;
      delete global.resetCodes[email];
      
      console.log(`✅ Password reset for ${email}`);
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, message: "رمز عبور با موفقیت تغییر کرد" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/send-code", async (req, res) => {
    try {
      console.log('Send code request:', req.body);
      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ message: "شماره تلفن الزامی است" });
      }
      
      const { mockUsers } = await import("./mockData");
      
      // Check if user exists
      const existingUser = mockUsers.find(u => u.phone === phone);
      const isNewUser = !existingUser;
      
      // Generate 2FA code
      const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
      const twoFactorExpiry = new Date(Date.now() + 5 * 60 * 1000);
      
      // Store 2FA code
      global.twoFactorCodes = global.twoFactorCodes || {};
      global.twoFactorCodes[phone] = { 
        code: twoFactorCode, 
        expiry: twoFactorExpiry,
        isNewUser,
        userRole: existingUser?.role || 'user'
      };
      
      // Always show code in console for development
      console.log(`\n🔐 2FA Code for ${phone}: ${twoFactorCode}`);
      console.log(`👤 ${isNewUser ? 'New User' : 'Existing User'}\n`);
      
      const message = existingUser?.role === 'admin' 
        ? "کد تایید در کنسول سرور نمایش داده شد" 
        : "کد تایید به شماره شما ارسال شد";
      
      res.json({ 
        requiresTwoFactor: true, 
        message,
        isNewUser,
        userType: isNewUser ? 'registration' : 'login',
        success: true
      });
    } catch (error: any) {
      console.error('Send code error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phone, password } = req.body;
      const { mockUsers } = await import("./mockData");
      
      const user = mockUsers.find(u => u.phone === phone);
      if (!user) {
        return res.status(401).json({ message: "Invalid phone or password" });
      }

      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid phone or password" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/verify-2fa", async (req, res) => {
    try {
      const { phone, code, name } = req.body;
      const { mockUsers } = await import("./mockData");
      
      const storedCode = global.twoFactorCodes?.[phone];
      if (!storedCode || storedCode.expiry < new Date()) {
        return res.status(401).json({ message: "کد منقضی شده یا نامعتبر است" });
      }
      
      if (storedCode.code !== code) {
        return res.status(401).json({ message: "کد تایید نادرست است" });
      }
      
      let user;
      
      if (storedCode.isNewUser) {
        // Create new user
        const newUserId = 'user_' + Date.now();
        user = {
          id: newUserId,
          name: name || 'کاربر جدید',
          phone: phone,
          role: 'user',
          createdAt: new Date()
        };
        
        // Add to mockUsers (in real app, save to database)
        mockUsers.push(user);
        console.log(`🎉 New user registered: ${user.name} (${phone})`);
      } else {
        // Existing user login
        user = mockUsers.find(u => u.phone === phone);
        if (!user) {
          return res.status(404).json({ message: "کاربر یافت نشد" });
        }
        console.log(`🔑 User logged in: ${user.name} (${phone})`);
      }
      
      // Clear used code
      if (global.twoFactorCodes && global.twoFactorCodes[phone]) {
        delete global.twoFactorCodes[phone];
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        user: userWithoutPassword,
        isNewUser: storedCode.isNewUser,
        message: storedCode.isNewUser ? 'ثبت نام با موفقیت انجام شد' : 'ورود با موفقیت انجام شد'
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized - please login first" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/listings", async (req, res) => {
    try {
      const { category, city, query } = req.query;
      const { mockListings } = await import("./mockData");

      // Use mock data as fallback
      let listings = mockListings;
      
      // Handle multiple categories
      if (category) {
        const categories = Array.isArray(category) ? category : [category];
        const validCategories = categories.filter(cat => cat !== 'all');
        if (validCategories.length > 0) {
          listings = listings.filter(l => validCategories.includes(l.category));
        }
      }
      
      // Handle multiple cities
      if (city) {
        const cities = Array.isArray(city) ? city : [city];
        if (cities.length > 0) {
          listings = listings.filter(l => cities.includes(l.city));
        }
      }
      
      if (query) {
        listings = listings.filter(l => 
          l.title.includes(query as string) || 
          l.description.includes(query as string)
        );
      }

      res.json(listings);
    } catch (error: any) {
      const { mockListings } = await import("./mockData");
      res.json(mockListings);
    }
  });

  app.get("/api/listings/:id", async (req, res) => {
    try {
      const { mockListings } = await import("./mockData");
      const listing = mockListings.find(l => l.id === req.params.id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.json(listing);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/listings", async (req, res) => {
    try {
      const validatedData = insertListingSchema.parse(req.body);
      const userId = req.body.userId || 'mock-user-123';

      const listing = await storage.createListing(validatedData, userId);
      res.status(201).json(listing);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/listings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await storage.updateListing(id, req.body);

      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      res.json(listing);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/listings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteListing(id);

      if (!deleted) {
        return res.status(404).json({ message: "Listing not found" });
      }

      res.json({ message: "Listing deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/user/:userId/listings", async (req, res) => {
    try {
      const { userId } = req.params;
      const listings = await storage.getUserListings(userId);
      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { mockUsers } = await import("./mockData");
      
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/user/:userId/profile", async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, bio, avatar } = req.body;
      const { mockUsers } = await import("./mockData");
      
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (avatar !== undefined) user.avatar = avatar;

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Message routes
  app.get("/api/messages/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const messages = await storage.getMessagesByUser(userId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/messages/listing/:listingId/:userId", async (req, res) => {
    try {
      const { listingId, userId } = req.params;
      const messages = await storage.getMessagesForListing(listingId, userId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    const userRole = req.headers['user-role'];
    if (userRole !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };

  // Admin routes
  app.get("/api/admin/pending-listings", requireAdmin, async (req, res) => {
    try {
      const listings = await storage.getPendingListings();
      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/approve-listing/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await storage.approveListing(id);

      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      res.json(listing);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Offline file routes
  app.post("/api/files", upload.single('file'), async (req, res) => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = await fileManager.saveFile(req.file, userId);
      res.status(201).json(file);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/files/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const files = await fileManager.getFiles(userId);
      res.json(files);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/files/download/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
      const file = await fileManager.getFile(fileId);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      res.setHeader('Content-Type', file.metadata.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename="${file.metadata.filename}"`);
      res.send(file.data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/files/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
      const { userId } = req.body;
      
      const deleted = await fileManager.deleteFile(fileId, userId);
      if (!deleted) {
        return res.status(404).json({ message: "File not found or unauthorized" });
      }

      res.json({ message: "File deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Favorites routes
  app.post("/api/favorites", async (req, res) => {
    try {
      const { userId, listingId } = req.body;
      global.favorites = global.favorites || [];
      const exists = global.favorites.find(f => f.userId === userId && f.listingId === listingId);
      if (exists) {
        return res.status(400).json({ message: "Already in favorites" });
      }
      const favorite = { id: 'fav_' + Date.now(), userId, listingId, createdAt: new Date() };
      global.favorites.push(favorite);
      res.status(201).json(favorite);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/favorites/:listingId", async (req, res) => {
    try {
      const { listingId } = req.params;
      const { userId } = req.body;
      global.favorites = global.favorites || [];
      const index = global.favorites.findIndex(f => f.userId === userId && f.listingId === listingId);
      if (index === -1) {
        return res.status(404).json({ message: "Not in favorites" });
      }
      global.favorites.splice(index, 1);
      res.json({ message: "Removed from favorites" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      global.favorites = global.favorites || [];
      const userFavorites = global.favorites.filter(f => f.userId === userId);
      res.json(userFavorites);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Reports routes
  app.post("/api/reports", async (req, res) => {
    try {
      const { listingId, reporterId, reason, description } = req.body;
      global.reports = global.reports || [];
      const report = {
        id: 'report_' + Date.now(),
        listingId,
        reporterId,
        reason,
        description,
        status: 'pending',
        createdAt: new Date()
      };
      global.reports.push(report);
      res.status(201).json(report);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Unread messages count
  app.get("/api/messages/unread/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const messages = await storage.getMessagesByUser(userId);
      const unreadCount = messages.filter(m => m.receiverId === userId && !m.read).length;
      res.json({ count: unreadCount });
    } catch (error: any) {
      res.status(500).json({ message: 0 });
    }
  });

  // Mark messages as read
  app.patch("/api/messages/read/:listingId", async (req, res) => {
    try {
      const { listingId } = req.params;
      const { userId } = req.body;
      const messages = await storage.getMessagesForListing(listingId, userId);
      // Mark as read (in real app, update database)
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Multiple images upload
  app.post("/api/upload-multiple", upload.array('images', 5), async (req, res) => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      const imageUrls = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
      res.json({ imageUrls });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
