// Base service for PostgreSQL API operations
export async function fetchAll<T>(table: string): Promise<T[]> {
  try {
    const response = await fetch(`/api/${table}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${table}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchAll for ${table}:`, error);
    return []; // Return empty array instead of throwing to prevent UI crashes
  }
}

export async function fetchById<T>(table: string, id: string): Promise<T | null> {
  try {
    const response = await fetch(`/api/${table}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch ${table} with id ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchById for ${table}:`, error);
    return null;
  }
}

export async function insert<T>(table: string, data: Partial<T>): Promise<T> {
  try {
    const response = await fetch(`/api/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create ${table}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in insert for ${table}:`, error);
    throw error;
  }
}

export async function update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
  try {
    const response = await fetch(`/api/${table}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update ${table}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in update for ${table}:`, error);
    throw error;
  }
}

export async function remove(table: string, id: string): Promise<void> {
  try {
    const response = await fetch(`/api/${table}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete ${table}`);
    }
  } catch (error) {
    console.error(`Error in remove for ${table}:`, error);
    throw error;
  }
}

// Activity logging function
export async function logActivity(
  action: string,
  type: string,
  description: string,
  username: string = 'system',
  status: string = 'completed'
) {
  try {
    await fetch('/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        type,
        description,
        username,
        status,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw here to avoid disrupting main operations
  }
}