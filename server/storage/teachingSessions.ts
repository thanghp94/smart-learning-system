import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { teachingSessions } from "@shared/schema";
import type { TeachingSession, InsertTeachingSession } from "@shared/schema";
import crypto from "crypto";

export class TeachingSessionStorage {
  async getTeachingSessions(): Promise<TeachingSession[]> {
    return await db.select().from(teachingSessions);
  }

  async getTeachingSession(id: string): Promise<TeachingSession | undefined> {
    const result = await db.select().from(teachingSessions).where(eq(teachingSessions.id, id));
    return result[0];
  }

  async createTeachingSession(session: InsertTeachingSession): Promise<TeachingSession> {
    const id = crypto.randomUUID();
    const sessionWithId = { ...session, id };
    const result = await db.insert(teachingSessions).values(sessionWithId).returning();
    return result[0];
  }

  async updateTeachingSession(id: string, session: Partial<InsertTeachingSession>): Promise<TeachingSession | undefined> {
    const result = await db.update(teachingSessions).set(session).where(eq(teachingSessions.id, id)).returning();
    return result[0];
  }

  async deleteTeachingSession(id: string): Promise<boolean> {
    const result = await db.delete(teachingSessions).where(eq(teachingSessions.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
