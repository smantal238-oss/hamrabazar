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
  { id: "balkh", nameFA: "بلخ", namePS: "بلخ", nameEN: "Balkh", icon: "🏺" },
  { id: "kandahar", nameFA: "قندهار", namePS: "کندهار", nameEN: "Kandahar", icon: "🏜️" },
  { id: "nangarhar", nameFA: "ننگرهار", namePS: "ننګرهار", nameEN: "Nangarhar", icon: "🏔️" },
  { id: "ghazni", nameFA: "غزنی", namePS: "غزني", nameEN: "Ghazni", icon: "🏰" },
  { id: "bamyan", nameFA: "بامیان", namePS: "بامیان", nameEN: "Bamyan", icon: "⛰️" },
  { id: "farah", nameFA: "فراه", namePS: "فراه", nameEN: "Farah", icon: "🌾" },
  { id: "kunduz", nameFA: "کندز", namePS: "کندز", nameEN: "Kunduz", icon: "🌿" },
  { id: "badakhshan", nameFA: "بدخشان", namePS: "بدخشان", nameEN: "Badakhshan", icon: "🗻" },
  { id: "helmand", nameFA: "هلمند", namePS: "هلمند", nameEN: "Helmand", icon: "🏜️" },
  { id: "paktia", nameFA: "پکتیا", namePS: "پکتیا", nameEN: "Paktia", icon: "🏔️" },
  { id: "paktika", nameFA: "پکتیکا", namePS: "پکتیکا", nameEN: "Paktika", icon: "⛰️" },
  { id: "khost", nameFA: "خوست", namePS: "خوست", nameEN: "Khost", icon: "🌲" },
  { id: "logar", nameFA: "لوگر", namePS: "لوګر", nameEN: "Logar", icon: "🌾" },
  { id: "wardak", nameFA: "میدان وردک", namePS: "وردک", nameEN: "Wardak", icon: "⛰️" },
  { id: "kapisa", nameFA: "کاپیسا", namePS: "کاپیسا", nameEN: "Kapisa", icon: "🏔️" },
  { id: "parwan", nameFA: "پروان", namePS: "پروان", nameEN: "Parwan", icon: "🏔️" },
  { id: "panjshir", nameFA: "پنجشیر", namePS: "پنجشير", nameEN: "Panjshir", icon: "🗻" },
  { id: "baghlan", nameFA: "بغلان", namePS: "بغلان", nameEN: "Baghlan", icon: "🌿" },
  { id: "takhar", nameFA: "تخار", namePS: "تخار", nameEN: "Takhar", icon: "🏔️" },
  { id: "samangan", nameFA: "سمنگان", namePS: "سمنګان", nameEN: "Samangan", icon: "🏛️" },
  { id: "sari-pul", nameFA: "سرپل", namePS: "سرپل", nameEN: "Sar-e Pol", icon: "🌾" },
  { id: "jawzjan", nameFA: "جوزجان", namePS: "جوزجان", nameEN: "Jawzjan", icon: "🏜️" },
  { id: "faryab", nameFA: "فاریاب", namePS: "فاریاب", nameEN: "Faryab", icon: "🌾" },
  { id: "badghis", nameFA: "بادغیس", namePS: "بادغیس", nameEN: "Badghis", icon: "🏜️" },
  { id: "ghor", nameFA: "غور", namePS: "غور", nameEN: "Ghor", icon: "⛰️" },
  { id: "daykundi", nameFA: "دایکندی", namePS: "دایکندی", nameEN: "Daykundi", icon: "🏔️" },
  { id: "uruzgan", nameFA: "ارزگان", namePS: "ارزګان", nameEN: "Uruzgan", icon: "🏜️" },
  { id: "zabul", nameFA: "زابل", namePS: "زابل", nameEN: "Zabul", icon: "🏜️" },
  { id: "nimroz", nameFA: "نیمروز", namePS: "نیمروز", nameEN: "Nimroz", icon: "🏜️" },
  { id: "laghman", nameFA: "لغمان", namePS: "لغمان", nameEN: "Laghman", icon: "🌲" },
  { id: "kunar", nameFA: "کنر", namePS: "کنړ", nameEN: "Kunar", icon: "🏔️" },
  { id: "nuristan", nameFA: "نورستان", namePS: "نورستان", nameEN: "Nuristan", icon: "🗻" },
] as const;
