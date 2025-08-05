import { db } from "../database/connection";
import { facilities } from "@shared/schema";
import { eq } from "drizzle-orm";

export class FacilityStorage {
  async getFacilitys() {
    console.log("Using PostgreSQL storage exclusively");
    try {
      const result = await db.select().from(facilities);
      return result;
    } catch (error) {
      console.error("Error fetching facilities:", error);
      return [];
    }
  }

  async getFacility(id: string) {
    console.log("Using PostgreSQL storage exclusively");
    try {
      const result = await db.select().from(facilities).where(eq(facilities.id, id));
      return result[0] || undefined;
    } catch (error) {
      console.error("Error fetching facility:", error);
      return undefined;
    }
  }

  async createFacility(facilityData: any) {
    console.log("Using PostgreSQL storage exclusively");
    try {
      const result = await db.insert(facilities).values(facilityData).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating facility:", error);
      throw error;
    }
  }

  async updateFacility(id: string, facilityData: any) {
    console.log("Using PostgreSQL storage exclusively");
    try {
      const result = await db
        .update(facilities)
        .set({ ...facilityData, updated_at: new Date() })
        .where(eq(facilities.id, id))
        .returning();
      return result[0] || undefined;
    } catch (error) {
      console.error("Error updating facility:", error);
      throw error;
    }
  }

  async deleteFacility(id: string) {
    console.log("Using PostgreSQL storage exclusively");
    try {
      const result = await db.delete(facilities).where(eq(facilities.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting facility:", error);
      return false;
    }
  }
}
