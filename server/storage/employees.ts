import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { employees } from "@shared/schema";
import type { Employee, InsertEmployee } from "@shared/schema";
import crypto from "crypto";

export class EmployeeStorage {
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.id, id));
    return result[0];
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const id = crypto.randomUUID();
    const employeeWithId = { ...employee, id };
    const result = await db.insert(employees).values(employeeWithId).returning();
    return result[0];
  }

  async updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const result = await db.update(employees).set(employee).where(eq(employees.id, id)).returning();
    return result[0];
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
