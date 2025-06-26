
/**
 * Creates the get_schema_info function - now uses PostgreSQL API
 */
export const setupSchemaFunction = async () => {
  try {
    // Since we're using PostgreSQL API now, this function is not needed
    return { success: true };
  } catch (error) {
    console.error('Error setting up schema function:', error);
    return { success: false, error };
  }
};

/**
 * Gets database schema information via PostgreSQL API
 */
export const getSchemaInfo = async () => {
  try {
    const response = await fetch('/api/database-schema');
    if (!response.ok) {
      throw new Error('Failed to fetch schema info');
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error getting schema info:', error);
    return { success: false, error };
  }
};

// Create and export a service object to maintain consistency with other services
export const schemaService = {
  setupSchemaFunction,
  getSchemaInfo
};
