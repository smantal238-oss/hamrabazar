import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  password: text("password").notNull(),
  twoFactorCode: text("two_factor_code"),
  twoFactorExpiry: timestamp("two_factor_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const listings = pgTable("listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  city: text("city").notNull(),
  imageUrl: text("image_url"),
  userId: varchar("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  twoFactorCode: true,
  twoFactorExpiry: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;

export const categories = [
  { id: "vehicles", nameFA: "وسایط نقلیه", namePS: "موټرونه", nameEN: "Vehicles", icon: "🚗" },
  { id: "realestate", nameFA: "املاک", namePS: "ملکیت", nameEN: "Real Estate", icon: "🏠" },
  { id: "electronics", nameFA: "الکترونیکی", namePS: "بریښنایی", nameEN: "Electronics", icon: "📱" },
  { id: "jewelry", nameFA: "جواهرات", namePS: "ګاڼې", nameEN: "Jewelry", icon: "💎" },
  { id: "mens-clothes", nameFA: "لباس مردانه", namePS: "نارینه جامې", nameEN: "Men's Clothes", icon: "👔" },
  { id: "womens-clothes", nameFA: "لباس زنانه", namePS: "ښځینه جامې", nameEN: "Women's Clothes", icon: "👗" },
  { id: "kids-clothes", nameFA: "لباس اطفال", namePS: "ماشومانو جامې", nameEN: "Kids' Clothes", icon: "👶" },
  { id: "books", nameFA: "آموزش", namePS: "زده کړه", nameEN: "Education", icon: "📚" },
  { id: "kids", nameFA: "لوازم کودک", namePS: "د ماشوم سامان", nameEN: "Kids' Items", icon: "🧸" },
  { id: "home", nameFA: "لوازم خانگی", namePS: "د کور سامان", nameEN: "Home Items", icon: "🛋️" },
  { id: "jobs", nameFA: "استخدام", namePS: "دنده", nameEN: "Jobs", icon: "💼" },
  { id: "services", nameFA: "خدمات", namePS: "خدمات", nameEN: "Services", icon: "🛠️" },
  { id: "games", nameFA: "سرگرمی", namePS: "تفریح", nameEN: "Entertainment", icon: "🎮" },
  { id: "sports", nameFA: "ورزشی", namePS: "ورزش", nameEN: "Sports", icon: "⚽" },
] as const;

export const cities = [
  { id: "kabul", nameFA: "کابل", namePS: "کابل", nameEN: "Kabul", icon: "🏛️" },
  { id: "herat", nameFA: "هرات", namePS: "هرات", nameEN: "Herat", icon: "🕌" },
  { id: "mazar", nameFA: "مزار شریف", namePS: "مزار شریف", nameEN: "Mazar-e-Sharif", icon: "🏺" },
  { id: "kandahar", nameFA: "قندهار", namePS: "کندهار", nameEN: "Kandahar", icon: "🏜️" },
  { id: "jalalabad", nameFA: "جلال‌آباد", namePS: "جلال‌آباد", nameEN: "Jalalabad", icon: "🏔️" },
  { id: "ghazni", nameFA: "غزنی", namePS: "غزني", nameEN: "Ghazni", icon: "🏰" },
  { id: "bamyan", nameFA: "بامیان", namePS: "بامیان", nameEN: "Bamyan", icon: "⛰️" },
  { id: "farah", nameFA: "فراه", namePS: "فراه", nameEN: "Farah", icon: "🌾" },
  { id: "kunduz", nameFA: "کندز", namePS: "کندز", nameEN: "Kunduz", icon: "🌿" },
  { id: "badakhshan", nameFA: "بدخشان", namePS: "بدخشان", nameEN: "Badakhshan", icon: "🏔️" },
] as const;
