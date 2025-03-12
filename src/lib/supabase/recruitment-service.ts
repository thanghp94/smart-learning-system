
import { supabase } from './client';

export type CandidateStatus = 
  'new_application' | 
  'cv_reviewing' | 
  'interview_scheduled' | 
  'passed_interview' | 
  'offer_sent' | 
  'hired' | 
  'rejected';

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  birth_date: string;
  gender: string;
  cv_path: string;
  linkedin_url: string;
  portfolio_url: string;
  current_status: CandidateStatus;
  current_position: string;
  years_of_experience: number;
  education_level: string;
  skills: string[];
  notes: string;
  created_at: string;
  updated_at: string;
  position_title?: string;
  department?: string;
  application_status?: CandidateStatus;
  applied_date?: string;
}

export interface RecruitmentStage {
  id: string;
  candidate_id: string;
  status: CandidateStatus;
  start_date: string;
  end_date: string | null;
  feedback: string;
  score: number;
  interviewer_id: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface RecruitmentPosition {
  id: string;
  title: string;
  description: string;
  requirements: string;
  is_active: boolean;
  facility_id: string | null;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  candidate_id: string;
  position_id: string;
  status: CandidateStatus;
  applied_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export const candidateService = {
  async getAll(): Promise<Candidate[]> {
    const { data, error } = await supabase
      .from('candidates_with_details')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }

    return data || [];
  },

  async getByStatus(status: CandidateStatus): Promise<Candidate[]> {
    const { data, error } = await supabase
      .from('candidates_with_details')
      .select('*')
      .eq('current_status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching candidates with status ${status}:`, error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<Candidate> {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }

    return data;
  },

  async create(candidate: Partial<Candidate>): Promise<Candidate> {
    const { data, error } = await supabase
      .from('candidates')
      .insert(candidate)
      .select()
      .single();

    if (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, candidate: Partial<Candidate>): Promise<Candidate> {
    const { data, error } = await supabase
      .from('candidates')
      .update(candidate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }

    return data;
  },

  async updateStatus(id: string, status: CandidateStatus): Promise<Candidate> {
    const { data, error } = await supabase
      .from('candidates')
      .update({ current_status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating candidate status:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  }
};

export const recruitmentStageService = {
  async getAll(): Promise<RecruitmentStage[]> {
    const { data, error } = await supabase
      .from('recruitment_stages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recruitment stages:', error);
      throw error;
    }

    return data || [];
  },

  async getByCandidateId(candidateId: string): Promise<RecruitmentStage[]> {
    const { data, error } = await supabase
      .from('recruitment_stages')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching stages for candidate ${candidateId}:`, error);
      throw error;
    }

    return data || [];
  },

  async create(stage: Partial<RecruitmentStage>): Promise<RecruitmentStage> {
    const { data, error } = await supabase
      .from('recruitment_stages')
      .insert(stage)
      .select()
      .single();

    if (error) {
      console.error('Error creating recruitment stage:', error);
      throw error;
    }

    return data;
  }
};

export const recruitmentPositionService = {
  async getAll(): Promise<RecruitmentPosition[]> {
    const { data, error } = await supabase
      .from('recruitment_positions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recruitment positions:', error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<RecruitmentPosition> {
    const { data, error } = await supabase
      .from('recruitment_positions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching recruitment position:', error);
      throw error;
    }

    return data;
  },

  async create(position: Partial<RecruitmentPosition>): Promise<RecruitmentPosition> {
    const { data, error } = await supabase
      .from('recruitment_positions')
      .insert(position)
      .select()
      .single();

    if (error) {
      console.error('Error creating recruitment position:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, position: Partial<RecruitmentPosition>): Promise<RecruitmentPosition> {
    const { data, error } = await supabase
      .from('recruitment_positions')
      .update(position)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating recruitment position:', error);
      throw error;
    }

    return data;
  }
};
