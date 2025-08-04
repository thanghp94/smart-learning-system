import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { students } from "@shared/schema";
import type { Student, InsertStudent } from "@shared/schema";
import crypto from "crypto";

export class StudentStorage {
  async getStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.id, id));
    return result[0];
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const id = crypto.randomUUID();
    const studentWithId = { ...student, id };
    const result = await db.insert(students).values(studentWithId).returning();
    return result[0];
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    const result = await db.update(students).set(student).where(eq(students.id, id)).returning();
    return result[0];
  }

  async deleteStudent(id: string): Promise<boolean> {
    const result = await db.delete(students).where(eq(students.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
