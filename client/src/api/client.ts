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

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
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
    return this.get<T[]>(`/${resource}`);
  }

  async getById<T>(resource: string, id: string): Promise<T> {
    return this.get<T>(`/${resource}/${id}`);
  }

  async create<T>(resource: string, data: any): Promise<T> {
    return this.post<T>(`/${resource}`, data);
  }

  async update<T>(resource: string, id: string, data: any): Promise<T> {
    return this.patch<T>(`/${resource}/${id}`, data);
  }

  async remove<T>(resource: string, id: string): Promise<T> {
    return this.delete<T>(`/${resource}/${id}`);
  }
}

export const apiClient = new ApiClient();
