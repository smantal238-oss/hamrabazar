import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertListingSchema, insertUserSchema, insertMessageSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { FileManager } from "./fileManager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileManager = new FileManager();

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
      
      if (category && category !== 'all') {
        listings = listings.filter(l => l.category === category);
      }
      
      if (city) {
        listings = listings.filter(l => l.city === city);
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

  const httpServer = createServer(app);

  return httpServer;
}
