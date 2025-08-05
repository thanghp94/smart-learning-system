// Base API client for the smart learning system
const API_BASE_URL = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is ok
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            // If it's not JSON, get text content
            const textContent = await response.text();
            if (textContent && !textContent.includes('<!DOCTYPE')) {
              errorMessage = textContent;
            }
          }
        } catch (parseError) {
          // If we can't parse the error, use the default message
          console.warn('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. This might indicate a server configuration issue.');
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the server is running.');
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Generic CRUD operations
  async getAll<T>(resource: string): Promise<T[]> {
    if (!resource || resource === 'undefined') {
      console.error('Invalid resource passed to getAll:', resource);
      throw new Error(`Invalid resource: ${resource}`);
    }
    return this.get<T[]>(`/${resource}`);
  }

  async getById<T>(resource: string, id: string): Promise<T> {
    if (!resource || resource === 'undefined') {
      console.error('Invalid resource passed to getById:', resource);
      throw new Error(`Invalid resource: ${resource}`);
    }
    return this.get<T>(`/${resource}/${id}`);
  }

  async create<T>(resource: string, data: any): Promise<T> {
    if (!resource || resource === 'undefined') {
      console.error('Invalid resource passed to create:', resource);
      throw new Error(`Invalid resource: ${resource}`);
    }
    return this.post<T>(`/${resource}`, data);
  }

  async update<T>(resource: string, id: string, data: any): Promise<T> {
    if (!resource || resource === 'undefined') {
      console.error('Invalid resource passed to update:', resource);
      throw new Error(`Invalid resource: ${resource}`);
    }
    return this.patch<T>(`/${resource}/${id}`, data);
  }

  async remove<T>(resource: string, id: string): Promise<T> {
    if (!resource || resource === 'undefined') {
      console.error('Invalid resource passed to remove:', resource);
      throw new Error(`Invalid resource: ${resource}`);
    }
    return this.delete<T>(`/${resource}/${id}`);
  }
}

export const apiClient = new ApiClient();
