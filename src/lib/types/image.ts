
export interface Image {
  id: string;
  doi_tuong: string;
  doi_tuong_id: string;
  ten_anh?: string;
  image?: string;
  video?: string;
  caption?: string;
  created_at?: string;
  updated_at?: string;
  tg_tao?: string;
  file_name?: string; // Add file_name property
}
