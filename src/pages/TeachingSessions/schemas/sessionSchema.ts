
import { z } from "zod";

export const sessionSchema = z.object({
  lop_chi_tiet_id: z.string().min(1, {
    message: "Vui lòng chọn một lớp học",
  }),
  giao_vien: z.string().min(1, {
    message: "Vui lòng chọn giáo viên",
  }),
  ngay_hoc: z.string().min(1, {
    message: "Vui lòng chọn ngày học",
  }),
  thoi_gian_bat_dau: z.string().min(1, {
    message: "Vui lòng nhập thời gian bắt đầu",
  }),
  thoi_gian_ket_thuc: z.string().min(1, {
    message: "Vui lòng nhập thời gian kết thúc",
  }),
  session_id: z.string().min(1, {
    message: "Vui lòng nhập buổi số",
  }),
  loai_bai_hoc: z.string().min(1, {
    message: "Vui lòng chọn loại bài học",
  }),
  phong_hoc_id: z.string().optional(),
  tro_giang: z.string().optional(),
  noi_dung: z.string().optional(),
  ghi_chu: z.string().optional(),
  co_so_id: z.string().optional(),
});

export type SessionFormData = z.infer<typeof sessionSchema>;
