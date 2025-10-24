import { type User, type InsertUser, type Listing, type InsertListing, type Message, type InsertMessage, users, listings, messages } from "@shared/schema";
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
  getPendingListings(): Promise<Listing[]>;
  approveListing(id: string): Promise<Listing | undefined>;

  getMessagesByUser(userId: string): Promise<Message[]>;
  getMessagesForListing(listingId: string, userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    try {
      if (!phone || typeof phone !== 'string') {
        return undefined;
      }
      const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user by phone:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async getListing(id: string): Promise<Listing | undefined> {
    const result = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    return result[0];
  }

  async getAllListings(): Promise<Listing[]> {
    return db.select().from(listings).where(eq(listings.approved, true)).orderBy(desc(listings.createdAt));
  }

  async getListingsByCategory(category: string): Promise<Listing[]> {
    return db.select().from(listings).where(and(eq(listings.category, category), eq(listings.approved, true))).orderBy(desc(listings.createdAt));
  }

  async getListingsByCity(city: string): Promise<Listing[]> {
    return db.select().from(listings).where(and(eq(listings.city, city), eq(listings.approved, true))).orderBy(desc(listings.createdAt));
  }

  async searchListings(query: string, category?: string, city?: string): Promise<Listing[]> {
    const conditions = [eq(listings.approved, true)];

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

    if (conditions.length === 1) {
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
      approved: false, // New listings start as unapproved
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

  async getPendingListings(): Promise<Listing[]> {
    return db.select().from(listings).where(eq(listings.approved, false)).orderBy(desc(listings.createdAt));
  }

  async approveListing(id: string): Promise<Listing | undefined> {
    const result = await db.update(listings)
      .set({ approved: true })
      .where(eq(listings.id, id))
      .returning();
    return result[0];
  }

  async getMessagesByUser(userId: string): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));
  }

  async getMessagesForListing(listingId: string, userId: string): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(and(
        eq(messages.listingId, listingId),
        or(eq(messages.senderId, userId), eq(messages.receiverId, userId))
      ))
      .orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(insertMessage).returning();
    return result[0];
  }
}

export const storage = new DbStorage();
