import { type User, type InsertUser, type Listing, type InsertListing, users, listings } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, like, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getListing(id: string): Promise<Listing | undefined>;
  getAllListings(): Promise<Listing[]>;
  getListingsByCategory(category: string): Promise<Listing[]>;
  getListingsByCity(city: string): Promise<Listing[]>;
  searchListings(query: string, category?: string, city?: string): Promise<Listing[]>;
  getUserListings(userId: string): Promise<Listing[]>;
  createListing(listing: InsertListing, userId: string): Promise<Listing>;
  updateListing(id: string, listing: Partial<InsertListing>): Promise<Listing | undefined>;
  deleteListing(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getListing(id: string): Promise<Listing | undefined> {
    const result = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    return result[0];
  }

  async getAllListings(): Promise<Listing[]> {
    return db.select().from(listings).orderBy(desc(listings.createdAt));
  }

  async getListingsByCategory(category: string): Promise<Listing[]> {
    return db.select().from(listings).where(eq(listings.category, category)).orderBy(desc(listings.createdAt));
  }

  async getListingsByCity(city: string): Promise<Listing[]> {
    return db.select().from(listings).where(eq(listings.city, city)).orderBy(desc(listings.createdAt));
  }

  async searchListings(query: string, category?: string, city?: string): Promise<Listing[]> {
    const conditions = [];
    
    if (query) {
      conditions.push(
        or(
          like(listings.title, `%${query}%`),
          like(listings.description, `%${query}%`)
        )
      );
    }
    
    if (category && category !== 'all') {
      conditions.push(eq(listings.category, category));
    }
    
    if (city) {
      conditions.push(eq(listings.city, city));
    }

    if (conditions.length === 0) {
      return this.getAllListings();
    }

    return db.select().from(listings).where(and(...conditions)).orderBy(desc(listings.createdAt));
  }

  async getUserListings(userId: string): Promise<Listing[]> {
    return db.select().from(listings).where(eq(listings.userId, userId)).orderBy(desc(listings.createdAt));
  }

  async createListing(insertListing: InsertListing, userId: string): Promise<Listing> {
    const result = await db.insert(listings).values({
      ...insertListing,
      userId,
    }).returning();
    return result[0];
  }

  async updateListing(id: string, listing: Partial<InsertListing>): Promise<Listing | undefined> {
    const result = await db.update(listings)
      .set(listing)
      .where(eq(listings.id, id))
      .returning();
    return result[0];
  }

  async deleteListing(id: string): Promise<boolean> {
    const result = await db.delete(listings).where(eq(listings.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();
