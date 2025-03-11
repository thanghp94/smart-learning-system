
import { z } from 'zod';

export const fileSchema = z.object({
  ten_tai_lieu: z.string().min(1, 'Tên tài liệu là bắt buộc'),
  doi_tuong_lien_quan: z.string().min(1, 'Đối tượng liên quan là bắt buộc'),
  nhom_tai_lieu: z.string().optional(),
  ngay_cap: z.string().optional().nullable(),
  han_tai_lieu: z.string().optional().nullable(),
  ghi_chu: z.string().optional(),
  trang_thai: z.string().optional(),
  
  // Entity IDs (one of these will be filled based on the selected entity type)
  nhan_vien_id: z.string().optional(),
  hoc_sinh_id: z.string().optional(),
  co_so_id: z.string().optional(),
  csvc_id: z.string().optional(),
  lien_he_id: z.string().optional(),
});

export type FileFormValues = z.infer<typeof fileSchema>;
