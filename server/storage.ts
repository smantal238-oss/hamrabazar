import { type User, type InsertUser, type Listing, type InsertListing } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getListing(id: string): Promise<Listing | undefined>;
  getAllListings(): Promise<Listing[]>;
  getListingsByCategory(category: string): Promise<Listing[]>;
  getListingsByCity(city: string): Promise<Listing[]>;
  createListing(listing: InsertListing, userId: string): Promise<Listing>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private listings: Map<string, Listing>;

  constructor() {
    this.users = new Map();
    this.listings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phone === phone,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      twoFactorCode: null,
      twoFactorExpiry: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getListing(id: string): Promise<Listing | undefined> {
    return this.listings.get(id);
  }

  async getAllListings(): Promise<Listing[]> {
    return Array.from(this.listings.values());
  }

  async getListingsByCategory(category: string): Promise<Listing[]> {
    return Array.from(this.listings.values()).filter(
      (listing) => listing.category === category,
    );
  }

  async getListingsByCity(city: string): Promise<Listing[]> {
    return Array.from(this.listings.values()).filter(
      (listing) => listing.city === city,
    );
  }

  async createListing(insertListing: InsertListing, userId: string): Promise<Listing> {
    const id = randomUUID();
    const listing: Listing = {
      ...insertListing,
      id,
      userId,
      imageUrl: insertListing.imageUrl || null,
      createdAt: new Date(),
    };
    this.listings.set(id, listing);
    return listing;
  }
}

export const storage = new MemStorage();
