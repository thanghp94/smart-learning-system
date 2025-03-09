
import { createClient } from '@supabase/supabase-js';

// Fallback values used only in demonstration mode
const DEFAULT_SUPABASE_URL = 'https://your-project-url.supabase.co';
const DEFAULT_SUPABASE_KEY = 'your-anon-key';

// Use environment variables if available, otherwise use defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

// Create a mock Supabase client when using default values
const usingDefaults = supabaseUrl === DEFAULT_SUPABASE_URL || supabaseKey === DEFAULT_SUPABASE_KEY;

// Create a client with handling for demo mode
export const supabase = usingDefaults 
  ? createMockClient() 
  : createClient(supabaseUrl, supabaseKey);

// Mock client implementation that returns sample data instead of errors
function createMockClient() {
  // Sample data for demo mode
  const mockTables = {
    'employees': [
      {
        id: 'e1',
        ten_nhan_su: 'Nguyễn Văn A',
        ten_tieng_anh: 'Nguyen Van A',
        dien_thoai: '0123456789',
        email: 'nva@example.com',
        tinh_trang_lao_dong: 'active',
        dia_chi: 'Hà Nội',
        gioi_tinh: 'Nam',
        ngay_sinh: '1990-01-01',
        bo_phan: 'Giáo viên',
        chuc_danh: 'GV',
        co_so_id: ['f1'],
        hinh_anh: null,
        tg_tao: new Date().toISOString()
      },
      {
        id: 'e2',
        ten_nhan_su: 'Trần Thị B',
        ten_tieng_anh: 'Tran Thi B',
        dien_thoai: '0987654321',
        email: 'ttb@example.com',
        tinh_trang_lao_dong: 'active',
        dia_chi: 'Hồ Chí Minh',
        gioi_tinh: 'Nữ',
        ngay_sinh: '1995-05-15',
        bo_phan: 'Giáo viên',
        chuc_danh: 'TG',
        co_so_id: ['f2'],
        hinh_anh: null,
        tg_tao: new Date().toISOString()
      }
    ],
    'classes': [
      {
        id: 'c1',
        Ten_lop_full: 'Toán Nâng Cao 10A',
        ten_lop: '10A',
        ct_hoc: 'Toán',
        co_so: 'f1',
        GV_chinh: 'e1',
        ngay_bat_dau: '2023-09-01',
        tinh_trang: 'active',
        ghi_chu: null,
        unit_id: 'UNIT01',
        tg_tao: new Date().toISOString(),
        so_hs: 15
      },
      {
        id: 'c2',
        Ten_lop_full: 'Tiếng Anh Cơ Bản 8B',
        ten_lop: '8B',
        ct_hoc: 'Tiếng Anh',
        co_so: 'f2',
        GV_chinh: 'e2',
        ngay_bat_dau: '2023-09-15',
        tinh_trang: 'active',
        ghi_chu: null,
        unit_id: 'UNIT02',
        tg_tao: new Date().toISOString(),
        so_hs: 12
      }
    ],
    'teaching_sessions': [
      {
        id: 'ts1',
        lop_chi_tiet_id: 'c1',
        session_id: 's1',
        Loai_bai_hoc: 'Lý thuyết',
        phong_hoc_id: 'ph1',
        ngay_hoc: '2023-09-05',
        thoi_gian_bat_dau: '08:00:00',
        thoi_gian_ket_thuc: '09:30:00',
        giao_vien: 'e1',
        tro_giang: 'e2',
        nhan_xet_1: '4',
        nhan_xet_2: '5',
        nhan_xet_3: '4',
        nhan_xet_4: '5',
        nhan_xet_5: '4',
        nhan_xet_6: '5',
        trung_binh: 4.5,
        nhan_xet_chung: 'Buổi dạy hiệu quả',
        ghi_chu: null
      },
      {
        id: 'ts2',
        lop_chi_tiet_id: 'c2',
        session_id: 's2',
        Loai_bai_hoc: 'Lý thuyết + Thực hành',
        phong_hoc_id: 'ph2',
        ngay_hoc: '2023-09-18',
        thoi_gian_bat_dau: '14:00:00',
        thoi_gian_ket_thuc: '15:30:00',
        giao_vien: 'e2',
        tro_giang: null,
        nhan_xet_1: '3',
        nhan_xet_2: '4',
        nhan_xet_3: '3',
        nhan_xet_4: '4',
        nhan_xet_5: '3',
        nhan_xet_6: '4',
        trung_binh: 3.5,
        nhan_xet_chung: 'Học sinh cần cải thiện',
        ghi_chu: null
      }
    ],
    'facilities': [
      {
        id: 'f1',
        loai_co_so: 'Trung tâm',
        ten_co_so: 'Cơ sở Hà Nội',
        dia_chi_co_so: '123 Đường ABC, Hà Nội',
        nguoi_chu: 'Nguyễn Văn X',
        phone: '0123456789',
        email: 'hanoi@example.com',
        nguoi_phu_trach: 'e1',
        ghi_chu: null,
        trang_thai: 'active',
        tg_tao: new Date().toISOString()
      },
      {
        id: 'f2',
        loai_co_so: 'Trung tâm',
        ten_co_so: 'Cơ sở Hồ Chí Minh',
        dia_chi_co_so: '456 Đường XYZ, Hồ Chí Minh',
        nguoi_chu: 'Trần Thị Y',
        phone: '0987654321',
        email: 'hcm@example.com',
        nguoi_phu_trach: 'e2',
        ghi_chu: null,
        trang_thai: 'active',
        tg_tao: new Date().toISOString()
      }
    ],
    'assets': [
      {
        id: 'a1',
        loai: 'Thiết bị điện tử',
        danh_muc: 'Máy tính',
        thuong_hieu: 'Dell',
        cau_hinh: 'Core i5, 8GB RAM, 256GB SSD',
        don_vi: 'Chiếc',
        ten_CSVC: 'Máy tính xách tay Dell Latitude',
        so_luong: 5,
        noi_mua: 'Công ty ABC',
        ngay_mua: '2023-01-15',
        doi_tuong: 'facility',
        doi_tuong_id: 'f1',
        trang_thai_so_huu: 'Sở hữu',
        tinh_trang: 'active'
      },
      {
        id: 'a2',
        loai: 'Thiết bị văn phòng',
        danh_muc: 'Máy in',
        thuong_hieu: 'HP',
        cau_hinh: 'LaserJet Pro',
        don_vi: 'Chiếc',
        ten_CSVC: 'Máy in HP LaserJet Pro',
        so_luong: 2,
        noi_mua: 'Công ty XYZ',
        ngay_mua: '2023-02-20',
        doi_tuong: 'facility',
        doi_tuong_id: 'f2',
        trang_thai_so_huu: 'Sở hữu',
        tinh_trang: 'active'
      }
    ],
    'asset_transfers': [
      {
        id: 'at1',
        asset_id: 'a1',
        source_type: 'facility',
        source_id: 'f1',
        destination_type: 'facility',
        destination_id: 'f2',
        quantity: 2,
        transfer_date: '2023-06-15',
        status: 'completed',
        notes: 'Chuyển máy tính cho cơ sở mới',
        created_at: '2023-06-15T08:30:00Z'
      },
      {
        id: 'at2',
        asset_id: 'a2',
        source_type: 'facility',
        source_id: 'f2',
        destination_type: 'employee',
        destination_id: 'e1',
        quantity: 1,
        transfer_date: '2023-07-20',
        status: 'pending',
        notes: 'Chuyển máy in cho nhân viên làm việc tại nhà',
        created_at: '2023-07-20T09:15:00Z'
      }
    ],
    'evaluations': [
      {
        id: 'ev1',
        doi_tuong: 'student',
        ghi_danh_id: 'en1',
        ten_danh_gia: 'Đánh giá cuối kỳ Toán',
        ngay_dau_dot_danh_gia: '2023-12-01',
        ngay_cuoi_dot_danh_gia: '2023-12-15',
        han_hoan_thanh: '2023-12-20',
        tieu_chi_1: 'Kỹ năng giải toán',
        tieu_chi_2: 'Sự chủ động',
        tieu_chi_3: 'Tư duy logic',
        nhan_xet_chi_tiet_1: 'Học sinh có khả năng giải toán tốt',
        nhan_xet_chi_tiet_2: 'Tích cực phát biểu trong lớp',
        nhan_xet_chi_tiet_3: 'Có tư duy logic tốt',
        nhan_xet_chung: 'Học sinh có tiến bộ rõ rệt',
        trang_thai: 'completed'
      },
      {
        id: 'ev2',
        doi_tuong: 'employee',
        nhanvien_id: 'e2',
        ten_danh_gia: 'Đánh giá giáo viên học kỳ 1',
        ngay_dau_dot_danh_gia: '2023-11-01',
        ngay_cuoi_dot_danh_gia: '2023-11-30',
        han_hoan_thanh: '2023-12-05',
        tieu_chi_1: 'Kỹ năng giảng dạy',
        tieu_chi_2: 'Quản lý lớp học',
        tieu_chi_3: 'Phương pháp đánh giá học sinh',
        nhan_xet_chi_tiet_1: 'Có phương pháp giảng dạy hiệu quả',
        nhan_xet_chi_tiet_2: 'Quản lý lớp học tốt',
        nhan_xet_chi_tiet_3: 'Đánh giá học sinh công bằng, khách quan',
        nhan_xet_chung: 'Giáo viên có năng lực chuyên môn tốt',
        trang_thai: 'completed'
      }
    ]
  };
  
  const mockClient = {
    from: (table: string) => ({
      select: (query?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => {
            const items = mockTables[table as keyof typeof mockTables] || [];
            const item = items.find((i: any) => i[column] === value);
            return Promise.resolve({ data: item || null, error: null });
          },
          order: (orderColumn: string, { ascending = true } = {}) => ({
            limit: (n: number) => {
              const items = mockTables[table as keyof typeof mockTables] || [];
              const filtered = items.filter((i: any) => i[column] === value);
              return Promise.resolve({ data: filtered.slice(0, n), error: null });
            }
          }),
          limit: (n: number) => {
            const items = mockTables[table as keyof typeof mockTables] || [];
            const filtered = items.filter((i: any) => i[column] === value);
            return Promise.resolve({ data: filtered.slice(0, n), error: null });
          }
        }),
        order: (orderColumn: string, { ascending = true } = {}) => ({
          limit: (n: number) => {
            const items = mockTables[table as keyof typeof mockTables] || [];
            return Promise.resolve({ data: items.slice(0, n), error: null });
          }
        }),
        count: () => {
          const items = mockTables[table as keyof typeof mockTables] || [];
          return Promise.resolve({ data: [{ count: items.length }], error: null });
        },
        limit: (n: number) => {
          const items = mockTables[table as keyof typeof mockTables] || [];
          return Promise.resolve({ data: items.slice(0, n), error: null });
        },
        single: () => {
          const items = mockTables[table as keyof typeof mockTables] || [];
          return Promise.resolve({ data: items[0] || null, error: null });
        }
      }),
      insert: (record: any) => ({
        select: () => ({
          single: () => {
            const newId = `new-${Math.random().toString(36).substring(2, 9)}`;
            const newRecord = { id: newId, ...record, created_at: new Date().toISOString() };
            return Promise.resolve({ data: newRecord, error: null });
          }
        })
      }),
      update: (updates: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => {
              const items = mockTables[table as keyof typeof mockTables] || [];
              const item = items.find((i: any) => i[column] === value);
              const updatedRecord = { ...item, ...updates, updated_at: new Date().toISOString() };
              return Promise.resolve({ data: updatedRecord, error: null });
            }
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => {
          return Promise.resolve({ error: null });
        }
      })
    }),
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: any) => Promise.resolve({ data: { path: `${bucket}/${path}` }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://mock-storage-url.com/${bucket}/${path}` } }),
        remove: (paths: string[]) => Promise.resolve({ error: null })
      })
    },
    auth: {
      onAuthStateChange: (callback: Function) => ({ data: null, error: null, unsubscribe: () => {} }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null })
    },
    rpc: (fn: string, params: any) => {
      if (fn === 'create_storage_buckets') {
        return Promise.resolve({ error: null });
      }
      return Promise.resolve({ data: null, error: null });
    }
  };
  
  return mockClient as any;
}
