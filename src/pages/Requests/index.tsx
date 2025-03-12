
// Update the RequestData interface to make nguoi_de_xuat_id required
interface RequestData extends Omit<Request, 'type'> {
  id: string;
  title: string;
  description?: string;
  requester: string;
  status: string;
  priority?: string;
  created_at: string;
  noi_dung?: string;
  ly_do?: string;
  nguoi_de_xuat_id: string; // Make this required to match Request interface
  trang_thai?: string;
  ngay_de_xuat?: string;
  request_type?: string;
  type: string; // Make this required to match Request interface
}
