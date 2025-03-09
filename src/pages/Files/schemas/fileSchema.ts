
import { z } from "zod";

export const fileSchema = z.object({
  ten_tai_lieu: z.string().min(1, { message: "Tên tài liệu không được để trống" }),
  doi_tuong_lien_quan: z.string().min(1, { message: "Đối tượng liên quan không được để trống" }),
  nhom_tai_lieu: z.string().optional(),
  ngay_cap: z.date().optional().nullable(),
  han_tai_lieu: z.date().optional().nullable(),
  ghi_chu: z.string().optional(),
  trang_thai: z.string().default("active"),
});

export type FileFormValues = z.infer<typeof fileSchema>;
