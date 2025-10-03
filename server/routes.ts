import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertListingSchema, insertUserSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
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
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByPhone(validatedData.phone);
      if (existingUser) {
        return res.status(400).json({ message: "Phone number already registered" });
      }
      
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });
      
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phone, password } = req.body;
      
      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(401).json({ message: "Invalid phone or password" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid phone or password" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
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
      
      if (query || category || city) {
        const listings = await storage.searchListings(
          query as string || '',
          category as string,
          city as string
        );
        return res.json(listings);
      }
      
      if (category && category !== 'all') {
        const listings = await storage.getListingsByCategory(category as string);
        return res.json(listings);
      }
      
      if (city) {
        const listings = await storage.getListingsByCity(city as string);
        return res.json(listings);
      }
      
      const listings = await storage.getAllListings();
      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/listings/:id", async (req, res) => {
    try {
      const listing = await storage.getListing(req.params.id);
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
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
