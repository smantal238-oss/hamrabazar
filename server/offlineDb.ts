import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

export const offlineFiles = sqliteTable("offline_files", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  filename: text("filename").notNull(),
  filepath: text("filepath").notNull(),
  filesize: integer("filesize").notNull(),
  mimetype: text("mimetype").notNull(),
  userId: text("user_id").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const insertOfflineFileSchema = createInsertSchema(offlineFiles).omit({
  id: true,
  createdAt: true,
});

export type InsertOfflineFile = typeof insertOfflineFileSchema._type;
export type OfflineFile = typeof offlineFiles.$inferSelect;

const sqlite = new Database("offline_files.db");
export const offlineDb = drizzle(sqlite, { schema: { offlineFiles } });

// Initialize table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS offline_files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    filesize INTEGER NOT NULL,
    mimetype TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )
`);