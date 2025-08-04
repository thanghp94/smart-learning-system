import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { requests } from "@shared/schema";
import type { Requests, InsertRequests } from "@shared/schema";
import crypto from "crypto";

export class RequestStorage {
  async getRequests(): Promise<Requests[]> {
    return await db.select().from(requests);
  }

  async getRequest(id: string): Promise<Requests | undefined> {
    const result = await db.select().from(requests).where(eq(requests.id, id));
    return result[0];
  }

  async createRequest(request: InsertRequests): Promise<Requests> {
    const id = crypto.randomUUID();
    const requestWithId = { ...request, id };
    const result = await db.insert(requests).values(requestWithId).returning();
    return result[0];
  }

  async updateRequest(id: string, request: Partial<InsertRequests>): Promise<Requests | undefined> {
    const result = await db.update(requests).set(request).where(eq(requests.id, id)).returning();
    return result[0];
  }

  async deleteRequest(id: string): Promise<boolean> {
    const result = await db.delete(requests).where(eq(requests.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
