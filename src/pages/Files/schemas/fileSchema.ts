
import { z } from 'zod';

export const fileSchema = z.object({
  ten_tai_lieu: z.string().min(1, 'Tên tài liệu là bắt buộc'),
  loai_doi_tuong: z.string().min(1, 'Loại đối tượng là bắt buộc'),
  doi_tuong_id: z.string().min(1, 'Đối tượng liên quan là bắt buộc'),
  duong_dan: z.string().optional(),
  nhom_tai_lieu: z.string().optional(),
  ngay_cap: z.string().optional().nullable(),
  han_tai_lieu: z.string().optional().nullable(),
  ghi_chu: z.string().optional(),
  trang_thai: z.string().optional(),
  // Fields to map to the correct database columns
  file1: z.string().optional(),
  nhan_vien_ID: z.string().optional(),
  lien_he_id: z.string().optional(),
  co_so_id: z.string().optional(),
  CSVC_ID: z.string().optional(),
  hoc_sinh_id: z.string().optional(),
});

export type FileFormData = z.infer<typeof fileSchema>;
export type FileFormValues = z.infer<typeof fileSchema>; // Add this for backward compatibility
