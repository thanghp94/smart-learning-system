
import { supabase } from './client';
import { Candidate } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class CandidateService {
  async getAll(): Promise<Candidate[]> {
    return fetchAll('candidates') as Promise<Candidate[]>;
  }

  async getById(id: string): Promise<Candidate> {
    return fetchById('candidates', id) as Promise<Candidate>;
  }

  async create(candidate: Partial<Candidate>): Promise<Candidate> {
    return insert('candidates', candidate) as Promise<Candidate>;
  }

  async update(id: string, data: Partial<Candidate>): Promise<Candidate> {
    return update('candidates', id, data) as Promise<Candidate>;
  }

  async delete(id: string): Promise<void> {
    return remove('candidates', id);
  }
  
  async getByStatus(status: string): Promise<Candidate[]> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('status', status);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting candidates by status:', error);
      return [];
    }
  }
}

export const candidateService = new CandidateService();
