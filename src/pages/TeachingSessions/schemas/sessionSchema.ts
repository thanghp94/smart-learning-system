
import { z } from "zod";

export const sessionSchema = z.object({
  lop_chi_tiet_id: z.string().min(1, "Vui lòng chọn lớp"),
  giao_vien: z.string().min(1, "Vui lòng chọn giáo viên"),
  ngay_hoc: z.string().min(1, "Vui lòng chọn ngày học"),
  thoi_gian_bat_dau: z.string().min(1, "Vui lòng nhập thời gian bắt đầu"),
  thoi_gian_ket_thuc: z.string().min(1, "Vui lòng nhập thời gian kết thúc"),
  session_id: z.string().min(1, "Vui lòng nhập số buổi học"),
  loai_bai_hoc: z.string().optional(), // Changed from Loai_bai_hoc to loai_bai_hoc
  noi_dung: z.string().optional(),
  nhan_xet_1: z.string().nullable().optional(),
  nhan_xet_2: z.string().nullable().optional(),
  nhan_xet_3: z.string().nullable().optional(),
  nhan_xet_4: z.string().nullable().optional(),
  nhan_xet_5: z.string().nullable().optional(),
  nhan_xet_6: z.string().nullable().optional(),
  trung_binh: z.number().nullable().optional(),
  phong_hoc_id: z.string().optional(),
  tro_giang: z.string().optional(),
  nhan_xet_chung: z.string().optional(),
  ghi_chu: z.string().optional(),
});

export type SessionFormData = z.infer<typeof sessionSchema>;
