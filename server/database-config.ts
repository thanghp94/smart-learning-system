import { storage } from "./storage";

// Database configuration - use PostgreSQL only
const USE_POSTGRESQL = true;

// Export PostgreSQL storage exclusively
export const activeStorage = storage;

// Helper function to check if PostgreSQL is available
export async function checkPostgreSQLConnection(): Promise<boolean> {
  try {
    await storage.getStudents();
    return true;
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
    return false;
  }
}

// Use PostgreSQL storage exclusively
export async function getStorage() {
  console.log('Using PostgreSQL storage exclusively');
  return storage;
}
