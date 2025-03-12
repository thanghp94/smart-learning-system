
import { supabase } from './client';
import { Candidate, CandidateStatus } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class CandidateService {
  tableName = 'candidates';

  async getAll(): Promise<Candidate[]> {
    return fetchAll<Candidate>(this.tableName);
  }

  async getById(id: string): Promise<Candidate | null> {
    return fetchById<Candidate>(this.tableName, id);
  }

  async create(candidate: Partial<Candidate>): Promise<Candidate> {
    return insert<Candidate>(this.tableName, candidate);
  }

  async update(id: string, updates: Partial<Candidate>): Promise<Candidate> {
    return update<Candidate>(this.tableName, id, updates);
  }

  async delete(id: string): Promise<void> {
    return remove(this.tableName, id);
  }

  async getByStatus(status: CandidateStatus): Promise<Candidate[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, positions(title)')
      .eq('status', status);
    
    if (error) {
      console.error(`Error fetching candidates with status ${status}:`, error);
      throw error;
    }
    
    return data.map(candidate => ({
      ...candidate,
      position_name: candidate.positions?.title
    }));
  }
}

export const candidateService = new CandidateService();
