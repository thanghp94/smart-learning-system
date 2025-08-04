import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { employeeClockIns } from "@shared/schema";
import type { EmployeeClockIns, InsertEmployeeClockIns } from "@shared/schema";
import crypto from "crypto";

export class EmployeeClockInStorage {
  async getEmployeeClockIns(): Promise<EmployeeClockIns[]> {
    return await db.select().from(employeeClockIns);
  }

  async getEmployeeClockIn(id: string): Promise<EmployeeClockIns | undefined> {
    const result = await db.select().from(employeeClockIns).where(eq(employeeClockIns.id, id));
    return result[0];
  }

  async createEmployeeClockIn(clockIn: InsertEmployeeClockIns): Promise<EmployeeClockIns> {
    const id = crypto.randomUUID();
    const clockInWithId = { ...clockIn, id };
    const result = await db.insert(employeeClockIns).values(clockInWithId).returning();
    return result[0];
  }

  async updateEmployeeClockIn(id: string, clockIn: Partial<InsertEmployeeClockIns>): Promise<EmployeeClockIns | undefined> {
    const result = await db.update(employeeClockIns).set(clockIn).where(eq(employeeClockIns.id, id)).returning();
    return result[0];
  }

  async deleteEmployeeClockIn(id: string): Promise<boolean> {
    const result = await db.delete(employeeClockIns).where(eq(employeeClockIns.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
