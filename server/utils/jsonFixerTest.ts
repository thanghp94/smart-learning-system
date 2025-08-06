import { buildJsonString } from '../routes';

const testObj = {
  id: "dc0b30bc-9a9c-433a-a559-af21b7267457",
  ten_hoc_sinh: "Final Fix Test",
  ngay_sinh: "2000-01-01",
  gioi_tinh: "Nam",
  dia_chi: null,
  so_dien_thoai: null,
  email: null,
  ten_phu_huynh: null,
  so_dien_thoai_phu_huynh: null,
  email_phu_huynh: null,
  trang_thai: "active",
  ghi_chu: null,
  created_at: new Date(),
  updated_at: new Date(),
};

const jsonString = buildJsonString(testObj);
console.log('JSON string output:');
console.log(jsonString);
