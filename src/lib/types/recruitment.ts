
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position_id?: string;
  position_name?: string;
  resume_url?: string;
  status: CandidateStatus;
  interview_date?: Date;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export enum CandidateStatus {
  NEW = 'new',
  SCREENING = 'screening',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected'
}

export interface Position {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
