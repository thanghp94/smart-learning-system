
import { z } from "zod";

export const sessionSchema = z.object({
  lop_chi_tiet_id: z.string().min(1, "Vui lòng chọn lớp"),
  giao_vien: z.string().min(1, "Vui lòng chọn giáo viên"),
  ngay_hoc: z.string().min(1, "Vui lòng chọn ngày học"),
  thoi_gian_bat_dau: z.string().min(1, "Vui lòng nhập thời gian bắt đầu"),
  thoi_gian_ket_thuc: z.string().min(1, "Vui lòng nhập thời gian kết thúc"),
  session_id: z.string().min(1, "Vui lòng nhập số buổi học"),
  Loai_bai_hoc: z.string().optional(),
  noi_dung: z.string().optional(),
  nhan_xet_1: z.string().optional().nullable(),
  nhan_xet_2: z.string().optional().nullable(),
  nhan_xet_3: z.string().optional().nullable(),
  nhan_xet_4: z.string().optional().nullable(),
  nhan_xet_5: z.string().optional().nullable(),
  nhan_xet_6: z.string().optional().nullable(),
  trung_binh: z.number().optional().nullable(),
});

export type SessionFormData = z.infer<typeof sessionSchema>;
