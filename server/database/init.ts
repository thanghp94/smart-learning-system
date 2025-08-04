import { db } from "./connection";

// For PostgreSQL with Drizzle, the tables are created automatically by the push command
// This function just verifies the database connection
export async function initializeDatabase() {
  try {
    console.log("Verifying PostgreSQL database connection...");
    
    // Test database connection
    await db.execute(`SELECT 1`);
    
    console.log("PostgreSQL database connection verified!");
    return true;
  } catch (error) {
    console.error("Error connecting to PostgreSQL database:", error);
    return false;
  }
}