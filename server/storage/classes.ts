import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { classes } from "@shared/schema";
import type { Class, InsertClass } from "@shared/schema";
import crypto from "crypto";

export class ClassStorage {
  async getClasses(): Promise<Class[]> {
    return await db.select().from(classes);
  }

  async getClass(id: string): Promise<Class | undefined> {
    const result = await db.select().from(classes).where(eq(classes.id, id));
    return result[0];
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const id = crypto.randomUUID();
    const classWithId = { ...classData, id };
    const result = await db.insert(classes).values(classWithId).returning();
    return result[0];
  }

  async updateClass(id: string, classData: Partial<InsertClass>): Promise<Class | undefined> {
    const result = await db.update(classes).set(classData).where(eq(classes.id, id)).returning();
    return result[0];
  }

  async deleteClass(id: string): Promise<boolean> {
    const result = await db.delete(classes).where(eq(classes.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
