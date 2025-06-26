import { supabase } from './supabase/client';
import { setupSchemaFunction } from './supabase/schema-service';
import { toast } from '@/hooks/use-toast';

// Initialize Supabase tables and configuration
export const initializeSupabase = async () => {
  console.log('Initializing Supabase configuration...');
  
  try {
    // Create storage buckets if they don't exist
    const buckets = ['student_photos', 'employee_photos', 'documents', 'assets'];
    for (const bucket of buckets) {
      try {
        const { error } = await supabase.storage.createBucket(bucket, {
          public: false,
          fileSizeLimit: 5242880, // 5MB
        });
        
        if (error && !error.message.includes('already exists')) {
          console.error(`Error creating bucket ${bucket}:`, error);
        } else {
          console.log(`Bucket ${bucket} created or already exists`);
        }
      } catch (err) {
        console.log(`Storage operation failed for bucket ${bucket}, likely using mock client`);
      }
    }
    
    // Set up the schema info function
    const schemaFunctionResult = await setupSchemaFunction();
    if (!schemaFunctionResult.success) {
      console.error('Error setting up schema function:', schemaFunctionResult.error);
    } else {
      console.log('Schema function set up successfully');
    }
    
    // In a real deployment, you would run the SQL script to create the database schema
    // For development/demo purposes, we'll assume the tables are already created
    
    console.log('Database initialization completed');
    return { success: true };
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    return { success: false, error };
  }
};

// Function to seed initial data (for development/testing)
export const seedInitialData = async () => {
  console.log('Seeding initial data...');
  
  try {
    // Check if we already have data
    const { data: existingFacilities } = await supabase
      .from('facilities')
      .select('count');
    
    if (existingFacilities && existingFacilities.length > 0 && existingFacilities[0].count > 0) {
      console.log('Data already exists, skipping seed');
      return { success: true, skipped: true };
    }
    
    // Insert sample facilities
    const { data: facilities, error: facilitiesError } = await supabase
      .from('facilities')
      .insert([
        {
          loai_co_so: 'Trung tâm',
          ten_co_so: 'Cơ sở Hà Nội',
          dia_chi_co_so: '123 Đường ABC, Hà Nội',
          phone: '0123456789',
          email: 'hanoi@example.com',
          trang_thai: 'active'
        },
        {
          loai_co_so: 'Trung tâm',
          ten_co_so: 'Cơ sở Hồ Chí Minh',
          dia_chi_co_so: '456 Đường XYZ, Hồ Chí Minh',
          phone: '0987654321',
          email: 'hcm@example.com',
          trang_thai: 'active'
        }
      ])
      .select();
    
    if (facilitiesError) {
      console.error('Error seeding facilities:', facilitiesError);
      return { success: false, error: facilitiesError };
    }
    
    // Insert sample employees
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .insert([
        {
          ten_nhan_su: 'Nguyễn Văn A',
          dien_thoai: '0123456789',
          email: 'nguyenvana@example.com',
          tinh_trang_lao_dong: 'active',
          dia_chi: 'Hà Nội',
          gioi_tinh: 'Nam',
          ngay_sinh: '1990-01-01',
          bo_phan: 'Admin',
          chuc_danh: 'Giám đốc',
          co_so_id: [facilities[0].id]
        },
        {
          ten_nhan_su: 'Trần Thị B',
          dien_thoai: '0987654321',
          email: 'tranthib@example.com',
          tinh_trang_lao_dong: 'active',
          dia_chi: 'Hồ Chí Minh',
          gioi_tinh: 'Nữ',
          ngay_sinh: '1995-05-15',
          bo_phan: 'Giáo viên',
          chuc_danh: 'GV',
          co_so_id: [facilities[1].id]
        },
        {
          ten_nhan_su: 'Lê Văn C',
          dien_thoai: '0912345678',
          email: 'levanc@example.com',
          tinh_trang_lao_dong: 'active',
          dia_chi: 'Hà Nội',
          gioi_tinh: 'Nam',
          ngay_sinh: '1992-03-20',
          bo_phan: 'Giáo viên',
          chuc_danh: 'TG',
          co_so_id: [facilities[0].id]
        }
      ])
      .select();
    
    if (employeesError) {
      console.error('Error seeding employees:', employeesError);
      return { success: false, error: employeesError };
    }
    
    // Update facilities with person in charge
    for (let i = 0; i < facilities.length; i++) {
      const { error: updateError } = await supabase
        .from('facilities')
        .update({ nguoi_phu_trach: employees[i].id })
        .eq('id', facilities[i].id);
      
      if (updateError) {
        console.error('Error updating facility:', updateError);
      }
    }
    
    // Insert sample students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .insert([
        {
          ten_hoc_sinh: 'Lê Văn D',
          gioi_tinh: 'Nam',
          ngay_sinh: '2010-03-10',
          co_so_ID: facilities[0].id,
          ten_PH: 'Lê Văn E',
          sdt_ph1: '0123123123',
          email_ph1: 'levane@example.com',
          dia_chi: 'Hà Nội',
          ct_hoc: 'Toán',
          trang_thai: 'active',
          han_hoc_phi: '2023-12-31'
        },
        {
          ten_hoc_sinh: 'Phạm Thị F',
          gioi_tinh: 'Nữ',
          ngay_sinh: '2012-07-22',
          co_so_ID: facilities[1].id,
          ten_PH: 'Phạm Văn G',
          sdt_ph1: '0456456456',
          email_ph1: 'phamvang@example.com',
          dia_chi: 'Hồ Chí Minh',
          ct_hoc: 'Tiếng Anh',
          trang_thai: 'active',
          han_hoc_phi: '2023-11-30'
        }
      ])
      .select();
    
    if (studentsError) {
      console.error('Error seeding students:', studentsError);
      return { success: false, error: studentsError };
    }
    
    // Insert sample classes
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .insert([
        {
          Ten_lop_full: 'Toán Nâng Cao 10A',
          ten_lop: '10A',
          ct_hoc: 'Toán',
          co_so: facilities[0].id,
          GV_chinh: employees[0].id,
          ngay_bat_dau: '2023-09-01',
          tinh_trang: 'active'
        },
        {
          Ten_lop_full: 'Tiếng Anh Cơ Bản 8B',
          ten_lop: '8B',
          ct_hoc: 'Tiếng Anh',
          co_so: facilities[1].id,
          GV_chinh: employees[1].id,
          ngay_bat_dau: '2023-09-15',
          tinh_trang: 'active'
        }
      ])
      .select();
    
    if (classesError) {
      console.error('Error seeding classes:', classesError);
      return { success: false, error: classesError };
    }
    
    // Insert sample sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .insert([
        {
          unit_id: 'UNIT01',
          buoi_hoc_so: 'Buổi 1',
          noi_dung_bai_hoc: 'Giới thiệu chương trình Toán nâng cao',
          bai_tap: 'Bài tập số 1-5 trang 15'
        },
        {
          unit_id: 'UNIT02',
          buoi_hoc_so: 'Buổi 1',
          noi_dung_bai_hoc: 'Introduction to Basic English Grammar',
          bai_tap: 'Exercises 1-10 page 8'
        }
      ])
      .select();
    
    if (sessionsError) {
      console.error('Error seeding sessions:', sessionsError);
      return { success: false, error: sessionsError };
    }
    
    // Insert sample teaching sessions
    const { data: teachingSessions, error: teachingSessionsError } = await supabase
      .from('teaching_sessions')
      .insert([
        {
          lop_chi_tiet_id: classes[0].id,
          session_id: sessions[0].id,
          Loai_bai_hoc: 'Lý thuyết',
          ngay_hoc: '2023-09-05',
          thoi_gian_bat_dau: '08:00:00',
          thoi_gian_ket_thuc: '09:30:00',
          giao_vien: employees[0].id,
          tro_giang: employees[2].id,
          nhan_xet_chung: 'Học sinh tích cực tham gia'
        },
        {
          lop_chi_tiet_id: classes[1].id,
          session_id: sessions[1].id,
          Loai_bai_hoc: 'Lý thuyết + Thực hành',
          ngay_hoc: '2023-09-18',
          thoi_gian_bat_dau: '14:00:00',
          thoi_gian_ket_thuc: '15:30:00',
          giao_vien: employees[1].id,
          nhan_xet_chung: 'Học sinh cần cải thiện kỹ năng nghe'
        }
      ])
      .select();
    
    if (teachingSessionsError) {
      console.error('Error seeding teaching sessions:', teachingSessionsError);
      return { success: false, error: teachingSessionsError };
    }
    
    // Insert sample enrollments
    const { error: enrollmentsError } = await supabase
      .from('enrollments')
      .insert([
        {
          hoc_sinh_id: students[0].id,
          lop_chi_tiet_id: classes[0].id,
          buoi_day_id: teachingSessions[0].id,
          tinh_trang_diem_danh: 'present',
          nhan_xet_tieu_chi_1: 'Tốt',
          nhan_xet_tieu_chi_2: 'Khá',
          nhan_xet_tieu_chi_3: 'Tốt'
        },
        {
          hoc_sinh_id: students[1].id,
          lop_chi_tiet_id: classes[1].id,
          buoi_day_id: teachingSessions[1].id,
          tinh_trang_diem_danh: 'present',
          nhan_xet_tieu_chi_1: 'Khá',
          nhan_xet_tieu_chi_2: 'Tốt',
          nhan_xet_tieu_chi_3: 'Khá'
        }
      ]);
    
    if (enrollmentsError) {
      console.error('Error seeding enrollments:', enrollmentsError);
      return { success: false, error: enrollmentsError };
    }
    
    // Insert sample assets
    const { error: assetsError } = await supabase
      .from('assets')
      .insert([
        {
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
          doi_tuong_id: facilities[0].id,
          trang_thai_so_huu: 'Sở hữu',
          tinh_trang: 'active'
        },
        {
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
          doi_tuong_id: facilities[1].id,
          trang_thai_so_huu: 'Sở hữu',
          tinh_trang: 'active'
        }
      ]);
    
    if (assetsError) {
      console.error('Error seeding assets:', assetsError);
      return { success: false, error: assetsError };
    }
    
    // Insert sample evaluations
    const { error: evaluationsError } = await supabase
      .from('evaluations')
      .insert([
        {
          doi_tuong: 'student',
          ghi_danh_id: students[0].id,
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
          doi_tuong: 'employee',
          nhanvien_id: employees[1].id,
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
      ]);
    
    if (evaluationsError) {
      console.error('Error seeding evaluations:', evaluationsError);
      return { success: false, error: evaluationsError };
    }
    
    console.log('Initial data seeded successfully');
    return { success: true };
  } catch (error) {
    console.error('Error seeding initial data:', error);
    return { success: false, error };
  }
};
