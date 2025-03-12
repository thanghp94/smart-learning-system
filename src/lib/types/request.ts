
export interface Request {
  id: string;
  type: string;
  title: string;
  description?: string;
  requester?: string;
  requested_date?: string;
  status: string;
  priority?: string;
  entity_type?: string;
  entity_id?: string;
  location?: string;
  processed_at?: string;
  created_at?: string;
  updated_at?: string;
}
