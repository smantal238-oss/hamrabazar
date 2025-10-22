import { offlineDb, offlineFiles } from "./offlineDb";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export class FileManager {
  private uploadDir = path.join(process.cwd(), "public/uploads");

  async saveFile(file: Express.Multer.File, userId: string) {
    const fileRecord = await offlineDb.insert(offlineFiles).values({
      id: randomUUID(),
      filename: file.originalname,
      filepath: file.path,
      filesize: file.size,
      mimetype: file.mimetype,
      userId,
      createdAt: new Date(),
    }).returning();
    
    return fileRecord[0];
  }

  async getFiles(userId: string) {
    return await offlineDb.select().from(offlineFiles).where(eq(offlineFiles.userId, userId));
  }

  async getFile(fileId: string) {
    const file = await offlineDb.select().from(offlineFiles).where(eq(offlineFiles.id, fileId));
    if (!file[0]) return null;
    
    const fileData = await fs.readFile(file[0].filepath);
    return { metadata: file[0], data: fileData };
  }

  async deleteFile(fileId: string, userId: string) {
    const file = await offlineDb.select().from(offlineFiles)
      .where(eq(offlineFiles.id, fileId));
    
    if (!file[0] || file[0].userId !== userId) return false;
    
    await fs.unlink(file[0].filepath);
    await offlineDb.delete(offlineFiles).where(eq(offlineFiles.id, fileId));
    return true;
  }
}