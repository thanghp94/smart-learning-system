
import { z } from "zod";

export const assetSchema = z.object({
  ten_csvc: z.string().min(1, "Tên CSVC là bắt buộc"),
  loai: z.string().optional(),
  danh_muc: z.string().optional(),
  so_luong: z.number().min(1, "Số lượng phải lớn hơn 0"),
  don_vi: z.string().min(1, "Đơn vị là bắt buộc"),
  so_tien_mua: z.string().optional(),
  tinh_trang: z.string().optional(),
  trang_thai_so_huu: z.string().optional(),
  mo_ta_1: z.string().optional(),
  thuong_hieu: z.string().optional(),
  mau: z.string().optional(),
  khu_vuc: z.string().optional(),
  hinh_anh: z.string().optional(),
  hinh_anh_2: z.string().optional(),
  ghi_chu: z.string().optional(),
});

export type AssetFormData = z.infer<typeof assetSchema>;
