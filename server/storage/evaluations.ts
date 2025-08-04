import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { evaluations } from "@shared/schema";
import type { Evaluations, InsertEvaluations } from "@shared/schema";
import crypto from "crypto";

export class EvaluationStorage {
  async getEvaluations(): Promise<Evaluations[]> {
    return await db.select().from(evaluations);
  }

  async getEvaluation(id: string): Promise<Evaluations | undefined> {
    const result = await db.select().from(evaluations).where(eq(evaluations.id, id));
    return result[0];
  }

  async createEvaluation(evaluation: InsertEvaluations): Promise<Evaluations> {
    const id = crypto.randomUUID();
    const evaluationWithId = { ...evaluation, id };
    const result = await db.insert(evaluations).values(evaluationWithId).returning();
    return result[0];
  }

  async updateEvaluation(id: string, evaluation: Partial<InsertEvaluations>): Promise<Evaluations | undefined> {
    const result = await db.update(evaluations).set(evaluation).where(eq(evaluations.id, id)).returning();
    return result[0];
  }

  async deleteEvaluation(id: string): Promise<boolean> {
    const result = await db.delete(evaluations).where(eq(evaluations.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
