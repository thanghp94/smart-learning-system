
import { Employee } from '@/lib/types';

export interface EmployeeFile {
  id: string;
  ten_tai_lieu: string;
  mo_ta?: string;
  loai_tai_lieu: string;
  duong_dan: string;
  nhan_vien_id: string;
  ngay_tao: string;
  ngay_cap_nhat?: string;
}

export interface EmployeeTableColumn {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any) => React.ReactNode;
}

export interface EmployeeFilters {
  search: string;
  facilityId: string;
  departmentId: string;
  positionId: string;
  status: string;
}

export interface EmployeeFormData extends Partial<Employee> {
  imageUrl?: string;
}
