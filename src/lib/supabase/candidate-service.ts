
import { supabase } from './client';
import { Candidate, CandidateStatus } from '@/lib/types';
import { BaseService } from './base-service';

class CandidateService extends BaseService<Candidate> {
  constructor() {
    super('candidates');
  }

  async getByStatus(status: CandidateStatus): Promise<Candidate[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, positions(title)')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching candidates by status:', error);
      throw error;
    }

    return data?.map(candidate => ({
      ...candidate,
      position_name: candidate.positions?.title
    })) || [];
  }

  async updateStatus(id: string, status: CandidateStatus): Promise<Candidate> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating candidate status:', error);
      throw error;
    }

    return data;
  }

  async scheduleInterview(id: string, date: Date): Promise<Candidate> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ 
        interview_date: date.toISOString(),
        status: CandidateStatus.INTERVIEW
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error scheduling interview:', error);
      throw error;
    }

    return data;
  }
}

export const candidateService = new CandidateService();
