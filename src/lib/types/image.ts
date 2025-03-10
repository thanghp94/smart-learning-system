
export interface Image {
  id: string;
  caption?: string;
  doi_tuong: string;
  doi_tuong_id: string;
  ten_anh: string;
  file_name?: string; // Added for compatibility
  url?: string; // Added for compatibility
  mime_type?: string; // Added for compatibility
  size?: number; // Added for compatibility
  description?: string; // Added for compatibility
  entity_type?: string; // Added for compatibility
  entity_id?: string; // Added for compatibility
  image?: string;
  video?: string;
  tg_tao?: string;
  created_at?: string;
}
