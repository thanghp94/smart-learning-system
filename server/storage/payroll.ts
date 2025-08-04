import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { payroll } from "@shared/schema";
import type { Payroll, InsertPayroll } from "@shared/schema";
import crypto from "crypto";

export class PayrollStorage {
  async getPayrolls(): Promise<Payroll[]> {
    return await db.select().from(payroll);
  }

  async getPayroll(id: string): Promise<Payroll | undefined> {
    const result = await db.select().from(payroll).where(eq(payroll.id, id));
    return result[0];
  }

  async createPayroll(payrollData: InsertPayroll): Promise<Payroll> {
    const id = crypto.randomUUID();
    const payrollWithId = { ...payrollData, id };
    const result = await db.insert(payroll).values(payrollWithId).returning();
    return result[0];
  }

  async updatePayroll(id: string, payrollData: Partial<InsertPayroll>): Promise<Payroll | undefined> {
    const result = await db.update(payroll).set(payrollData).where(eq(payroll.id, id)).returning();
    return result[0];
  }

  async deletePayroll(id: string): Promise<boolean> {
    const result = await db.delete(payroll).where(eq(payroll.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
