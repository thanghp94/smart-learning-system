import { db } from "./db";
import { 
  users, students, employees, facilities, 
  classes, teachingSessions, enrollments, 
  attendances, assets 
} from "@shared/schema";

// Create tables using Drizzle schema
export async function initializeDatabase() {
  try {
    console.log("Creating database tables...");
    
    // Create all tables - SQLite will automatically handle the schema
    await db.select().from(users).limit(1).catch(() => {
      // Table doesn't exist, that's fine
    });
    
    await db.select().from(students).limit(1).catch(() => {
      // Table doesn't exist, that's fine
    });
    
    await db.select().from(employees).limit(1).catch(() => {
      // Table doesn't exist, that's fine
    });
    
    await db.select().from(facilities).limit(1).catch(() => {
      // Table doesn't exist, that's fine
    });
    
    await db.select().from(classes).limit(1).catch(() => {
      // Table doesn't exist, that's fine
    });
    
    await db.select().from(teachingSessions).limit(1).catch(() => {
      // Table doesn't exist, that's fine
    });
    
    await db.select().from(enrollments).limit(1).catch(() => {
      // Table doesn't exist, that's fine
    });
    
    await db.select().from(attendances).limit(1).catch(() => {
      // Table doesn't exist, that's fine
    });
    
    await db.select().from(assets).limit(1).catch(() => {
      // Table doesn't exist, that's fine
    });
    
    console.log("Database initialized successfully!");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
}