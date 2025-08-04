import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { admissions } from "@shared/schema";
import type { Admissions, InsertAdmissions } from "@shared/schema";
import crypto from "crypto";

export class AdmissionStorage {
  async getAdmissions(): Promise<Admissions[]> {
    return await db.select().from(admissions);
  }

  async getAdmission(id: string): Promise<Admissions | undefined> {
    const result = await db.select().from(admissions).where(eq(admissions.id, id));
    return result[0];
  }

  async createAdmission(admission: InsertAdmissions): Promise<Admissions> {
    const id = crypto.randomUUID();
    const admissionWithId = { ...admission, id };
    const result = await db.insert(admissions).values(admissionWithId).returning();
    return result[0];
  }

  async updateAdmission(id: string, admission: Partial<InsertAdmissions>): Promise<Admissions | undefined> {
    const result = await db.update(admissions).set(admission).where(eq(admissions.id, id)).returning();
    return result[0];
  }

  async deleteAdmission(id: string): Promise<boolean> {
    const result = await db.delete(admissions).where(eq(admissions.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
