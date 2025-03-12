
import { supabase } from './client';
import { Candidate, CandidateStatus } from '@/lib/types/recruitment';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class CandidateService {
  async getAll(): Promise<Candidate[]> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*, positions(title)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(candidate => ({
        ...candidate,
        position_name: candidate.positions?.title || null
      }));
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Candidate | null> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*, positions(title)')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        position_name: data.positions?.title || null
      };
    } catch (error) {
      console.error('Error fetching candidate by ID:', error);
      return null;
    }
  }

  async create(candidate: Omit<Candidate, 'id'>): Promise<Candidate | null> {
    return insert('candidates', candidate) as Promise<Candidate | null>;
  }

  async update(id: string, candidate: Partial<Candidate>): Promise<Candidate | null> {
    return update('candidates', id, candidate) as Promise<Candidate | null>;
  }

  async updateStatus(id: string, status: CandidateStatus): Promise<Candidate | null> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    return remove('candidates', id);
  }

  async getByStatus(status: CandidateStatus): Promise<Candidate[]> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*, positions(title)')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(candidate => ({
        ...candidate,
        position_name: candidate.positions?.title || null
      }));
    } catch (error) {
      console.error(`Error fetching candidates with status ${status}:`, error);
      return [];
    }
  }
}

export const candidateService = new CandidateService();
