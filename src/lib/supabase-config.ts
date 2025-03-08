
import { supabase } from './supabase';

// Initialize Supabase tables and configuration
export const initializeSupabase = async () => {
  console.log('Initializing Supabase configuration...');
  
  try {
    // Create storage buckets if they don't exist
    const storageResponse = await supabase.rpc('create_storage_buckets', {
      buckets: ['student_photos', 'employee_photos', 'documents', 'assets']
    });
    
    if (storageResponse.error) {
      console.error('Error creating storage buckets:', storageResponse.error);
    } else {
      console.log('Storage buckets created successfully');
    }
    
    // Run SQL script to create database schema
    // Note: In a real application, you might want to use migration tools
    // or Supabase's SQL editor to run the SQL script
    console.log('Database schema setup should be done through Supabase SQL Editor');
    
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
    const { error: studentsError } = await supabase
      .from('students')
      .insert([
        {
          ten_hoc_sinh: 'Lê Văn C',
          gioi_tinh: 'Nam',
          ngay_sinh: '2010-03-10',
          co_so_ID: facilities[0].id,
          ten_PH: 'Lê Văn D',
          sdt_ph1: '0123123123',
          email_ph1: 'levand@example.com',
          dia_chi: 'Hà Nội',
          ct_hoc: 'Toán',
          trang_thai: 'active',
          han_hoc_phi: '2023-12-31'
        },
        {
          ten_hoc_sinh: 'Phạm Thị E',
          gioi_tinh: 'Nữ',
          ngay_sinh: '2012-07-22',
          co_so_ID: facilities[1].id,
          ten_PH: 'Phạm Văn F',
          sdt_ph1: '0456456456',
          email_ph1: 'phamvanf@example.com',
          dia_chi: 'Hồ Chí Minh',
          ct_hoc: 'Tiếng Anh',
          trang_thai: 'active',
          han_hoc_phi: '2023-11-30'
        }
      ]);
    
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
    
    console.log('Initial data seeded successfully');
    return { success: true };
  } catch (error) {
    console.error('Error seeding initial data:', error);
    return { success: false, error };
  }
};
