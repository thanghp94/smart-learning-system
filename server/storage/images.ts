import { eq } from "drizzle-orm";
import { db } from "../db";
import { images } from "@shared/schema";
import type { Images, InsertImages } from "@shared/schema";
import crypto from "crypto";

export class ImageStorage {
  async getImages(): Promise<Images[]> {
    return await db.select().from(images);
  }

  async getImage(id: string): Promise<Images | undefined> {
    const result = await db.select().from(images).where(eq(images.id, id));
    return result[0];
  }

  async createImage(image: InsertImages): Promise<Images> {
    const id = crypto.randomUUID();
    const imageWithId = { ...image, id };
    const result = await db.insert(images).values(imageWithId).returning();
    return result[0];
  }

  async updateImage(id: string, image: Partial<InsertImages>): Promise<Images | undefined> {
    const result = await db.update(images).set(image).where(eq(images.id, id)).returning();
    return result[0];
  }

  async deleteImage(id: string): Promise<boolean> {
    const result = await db.delete(images).where(eq(images.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
