import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertListingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
