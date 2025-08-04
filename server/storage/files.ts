import { eq } from "drizzle-orm";
import { db } from "../db";
import { files } from "@shared/schema";
import type { Files, InsertFiles } from "@shared/schema";
import crypto from "crypto";

export class FileStorage {
  async getFiles(): Promise<Files[]> {
    return await db.select().from(files);
  }

  async getFile(id: string): Promise<Files | undefined> {
    const result = await db.select().from(files).where(eq(files.id, id));
    return result[0];
  }

  async createFile(file: InsertFiles): Promise<Files> {
    const id = crypto.randomUUID();
    const fileWithId = { ...file, id };
    const result = await db.insert(files).values(fileWithId).returning();
    return result[0];
  }

  async updateFile(id: string, file: Partial<InsertFiles>): Promise<Files | undefined> {
    const result = await db.update(files).set(file).where(eq(files.id, id)).returning();
    return result[0];
  }

  async deleteFile(id: string): Promise<boolean> {
    const result = await db.delete(files).where(eq(files.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
