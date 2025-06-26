
import { z } from "zod";

export const studentSchema = z.object({
  ten_hoc_sinh: z.string().min(2, { message: "Tên học sinh phải có ít nhất 2 ký tự" }),
  gioi_tinh: z.string().optional(),
  ngay_sinh: z.date().optional().nullable(),
  co_so_id: z.string().optional(),
  ten_PH: z.string().optional(), // Kept as is for form, mapped in service
  sdt_ph1: z.string().optional(),
  email_ph1: z.string().optional(),
  dia_chi: z.string().optional(),
  password: z.string().optional(),
  trang_thai: z.string().default("active"),
  ct_hoc: z.string().optional(),
  han_hoc_phi: z.date().optional().nullable(),
  ngay_bat_dau_hoc_phi: z.date().optional().nullable(),
  ghi_chu: z.string().optional(), // Kept as is for form, mapped in service
  parentpassword: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
