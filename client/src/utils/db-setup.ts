import { supabase } from '@/lib/supabase/client';

// Function to create the database schema
export const createDatabaseSchema = async (): Promise<boolean> => {
  try {
    // SQL script to create the schema
    const sql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS public.classes (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        ten_lop_full TEXT NOT NULL,
        ten_lop TEXT NOT NULL,
        ct_hoc TEXT,
        co_so UUID,
        gv_chinh UUID,
        ngay_bat_dau DATE,
        tinh_trang TEXT DEFAULT 'active',
        ghi_chu TEXT,
        unit_id TEXT,
        tg_tao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
      
      CREATE TABLE IF NOT EXISTS public.students (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        ten_hoc_sinh TEXT,
        gioi_tinh TEXT,
        ngay_sinh DATE,
        co_so_id UUID,
        ten_PH TEXT,
        sdt_ph1 TEXT,
        email_ph1 TEXT,
        dia_chi TEXT,
        password TEXT,
        trang_thai TEXT,
        ct_hoc TEXT,
        han_hoc_phi DATE,
        ngay_bat_dau_hoc_phi DATE,
        ghi_chu TEXT,
        parentpassword TEXT
      );
      
      CREATE TABLE IF NOT EXISTS public.sessions (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        unit_id TEXT,
        buoi_hoc_so TEXT NOT NULL,
        tsi_lesson_plan TEXT,
        noi_dung_bai_hoc TEXT NOT NULL,
        rep_lesson_plan TEXT,
        bai_tap TEXT,
        tg_tao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
      
      CREATE TABLE IF NOT EXISTS public.facilities (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        ten_co_so TEXT NOT NULL,
        loai_co_so TEXT NOT NULL,
        dia_chi_co_so TEXT,
        phone TEXT,
        email TEXT,
        trang_thai TEXT DEFAULT 'active',
        nguoi_phu_trach UUID,
        ghi_chu TEXT,
        nguoi_chu TEXT,
        tg_tao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `;

    // Execute the SQL script
    const { error } = await supabase.rpc('run_sql', { sql });

    if (error) {
      console.error('Error creating database schema:', error);
      return false;
    }

    console.log('Database schema created successfully');
    return true;
  } catch (error) {
    console.error('Error creating database schema:', error);
    return false;
  }
};

// Function to seed the database with initial data
export const seedDatabase = async (): Promise<boolean> => {
  try {
    // Insert sample data into the classes table
    const { error: classesError } = await supabase
      .from('classes')
      .insert([
        { ten_lop_full: 'Lớp Toán 1A', ten_lop: 'Toán 1A', ct_hoc: 'Toán' },
        { ten_lop_full: 'Lớp Tiếng Anh 2B', ten_lop: 'Anh 2B', ct_hoc: 'Tiếng Anh' },
        { ten_lop_full: 'Lớp Vật Lý 3C', ten_lop: 'Lý 3C', ct_hoc: 'Vật Lý' },
      ]);

    if (classesError) {
      console.error('Error seeding classes table:', classesError);
      return false;
    }

    // Insert sample data into the students table
    const { error: studentsError } = await supabase
      .from('students')
      .insert([
        { ten_hoc_sinh: 'Nguyễn Văn A', gioi_tinh: 'Nam', ngay_sinh: '2010-01-01' },
        { ten_hoc_sinh: 'Trần Thị B', gioi_tinh: 'Nữ', ngay_sinh: '2010-02-15' },
        { ten_hoc_sinh: 'Lê Văn C', gioi_tinh: 'Nam', ngay_sinh: '2009-11-20' },
      ]);

    if (studentsError) {
      console.error('Error seeding students table:', studentsError);
      return false;
    }
    
    // Insert sample data into the sessions table
    const { error: sessionsError } = await supabase
      .from('sessions')
      .insert([
        { 
          buoi_hoc_so: '1', 
          noi_dung_bai_hoc: 'Giới thiệu về phương pháp học tập', 
          unit_id: '1',
          tsi_lesson_plan: 'Làm quen với học sinh và giới thiệu phương pháp học tập', 
          rep_lesson_plan: 'Giới thiệu và làm các bài tập nhóm', 
          bai_tap: 'Bài tập về nhà: Đọc chương 1' 
        },
        { 
          buoi_hoc_so: '2', 
          noi_dung_bai_hoc: 'Luyện tập kỹ năng cơ bản', 
          unit_id: '1',
          tsi_lesson_plan: 'Thực hành các kỹ năng đã học', 
          rep_lesson_plan: 'Chia nhóm và làm bài tập thực hành', 
          bai_tap: 'Bài tập về nhà: Hoàn thành phần bài tập' 
        },
      ]);

    if (sessionsError) {
      console.error('Error seeding sessions table:', sessionsError);
      return false;
    }
    
    // Insert sample data into the facilities table
    const { error: facilitiesError } = await supabase
      .from('facilities')
      .insert([
        { ten_co_so: 'Cơ sở 1', loai_co_so: 'Chi nhánh', dia_chi_co_so: '123 Đường ABC', phone: '0901234567', email: 'coso1@example.com', trang_thai: 'active' },
        { ten_co_so: 'Cơ sở 2', loai_co_so: 'Trung tâm', dia_chi_co_so: '456 Đường XYZ', phone: '0909876543', email: 'coso2@example.com', trang_thai: 'active' },
        { ten_co_so: 'Cơ sở 3', loai_co_so: 'Văn phòng', dia_chi_co_so: '789 Đường MNO', phone: '0903456789', email: 'coso3@example.com', trang_thai: 'inactive' },
      ]);

    if (facilitiesError) {
      console.error('Error seeding facilities table:', facilitiesError);
      return false;
    }

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

// Add a function to apply public access policies
export const applyPublicAccessPolicies = async () => {
  try {
    // Read the SQL script content for public access policies
    const sql = `
      -- Disable RLS on all tables for development
      
      -- Drop existing RLS policies on facilities if any exist
      DROP POLICY IF EXISTS "Allow public access to facilities" ON public.facilities;
      
      -- Add public access policy to facilities table
      CREATE POLICY "Allow public access to facilities"
      ON public.facilities
      FOR ALL
      USING (true)
      WITH CHECK (true);
      
      -- Ensure RLS is enabled for the facilities table
      ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
      
      -- Drop existing RLS policies on classes if any exist
      DROP POLICY IF EXISTS "Allow public access to classes" ON public.classes;
      
      -- Add public access policy to classes table
      CREATE POLICY "Allow public access to classes"
      ON public.classes
      FOR ALL
      USING (true)
      WITH CHECK (true);
      
      -- Ensure RLS is enabled for the classes table
      ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
      
      -- Drop existing RLS policies on students if any exist
      DROP POLICY IF EXISTS "Allow public access to students" ON public.students;
      
      -- Add public access policy to students table
      CREATE POLICY "Allow public access to students"
      ON public.students
      FOR ALL
      USING (true)
      WITH CHECK (true);
      
      -- Ensure RLS is enabled for the students table
      ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
      
      -- Drop existing RLS policies on sessions if any exist
      DROP POLICY IF EXISTS "Allow public access to sessions" ON public.sessions;
      
      -- Add public access policy to sessions table
      CREATE POLICY "Allow public access to sessions"
      ON public.sessions
      FOR ALL
      USING (true)
      WITH CHECK (true);
      
      -- Ensure RLS is enabled for the sessions table
      ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
    `;
    
    // Execute the SQL script via Supabase
    const { error } = await supabase.rpc('run_sql', { sql });
    
    if (error) {
      console.error('Error applying public access policies:', error);
      return false;
    }
    
    console.log('Successfully applied public access policies');
    return true;
  } catch (error) {
    console.error('Exception applying public access policies:', error);
    return false;
  }
};

// Add a function to create the class function
export const createClassFunction = async (): Promise<boolean> => {
  try {
    // SQL script to create the class function
    const sql = `
      CREATE OR REPLACE FUNCTION create_class(class_data JSONB)
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        new_class_id UUID;
        new_class JSONB;
      BEGIN
        -- If an ID is provided in the data, use it. Otherwise generate a new UUID
        new_class_id := COALESCE(
          (class_data->>'id')::UUID,
          uuid_generate_v4()
        );
        
        INSERT INTO classes (
          id,
          ten_lop_full, 
          ten_lop, 
          ct_hoc, 
          co_so, 
          gv_chinh, 
          ngay_bat_dau, 
          tinh_trang, 
          ghi_chu, 
          unit_id
        )
        VALUES (
          new_class_id,
          class_data->>'ten_lop_full',
          class_data->>'ten_lop',
          class_data->>'ct_hoc',
          NULLIF(class_data->>'co_so', '')::UUID,
          NULLIF(class_data->>'gv_chinh', '')::UUID,
          (class_data->>'ngay_bat_dau')::DATE,
          COALESCE(class_data->>'tinh_trang', 'active'),
          class_data->>'ghi_chu',
          class_data->>'unit_id'
        )
        RETURNING to_jsonb(classes.*) INTO new_class;
        
        RETURN new_class;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE NOTICE 'Error in create_class function: %', SQLERRM;
          RETURN jsonb_build_object(
            'error', SQLERRM,
            'code', SQLSTATE
          );
      END;
      $$;
      
      CREATE OR REPLACE FUNCTION create_session(session_data JSONB)
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        new_session_id UUID;
        new_session JSONB;
      BEGIN
        -- If an ID is provided in the data, use it. Otherwise generate a new UUID
        new_session_id := COALESCE(
          (session_data->>'id')::UUID,
          uuid_generate_v4()
        );
        
        INSERT INTO sessions (
          id,
          unit_id,
          buoi_hoc_so,
          noi_dung_bai_hoc,
          tsi_lesson_plan,
          rep_lesson_plan,
          bai_tap
        )
        VALUES (
          new_session_id,
          session_data->>'unit_id',
          session_data->>'buoi_hoc_so',
          session_data->>'noi_dung_bai_hoc',
          session_data->>'tsi_lesson_plan',
          session_data->>'rep_lesson_plan',
          session_data->>'bai_tap'
        )
        RETURNING to_jsonb(sessions.*) INTO new_session;
        
        RETURN new_session;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE NOTICE 'Error in create_session function: %', SQLERRM;
          RETURN jsonb_build_object(
            'error', SQLERRM,
            'code', SQLSTATE
          );
      END;
      $$;
    `;
    
    // Execute the SQL script
    const { error } = await supabase.rpc('run_sql', { sql });
    
    if (error) {
      console.error('Error creating functions:', error);
      return false;
    }
    
    console.log('Database functions created successfully');
    return true;
  } catch (error) {
    console.error('Error creating database functions:', error);
    return false;
  }
};

// Update the disableRLSForDevelopment function to explicitly disable RLS for classes
export const disableRLSForDevelopment = async (): Promise<boolean> => {
  try {
    const sql = `
      -- Disable RLS on all main tables for development
      ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.facilities DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.teaching_sessions DISABLE ROW LEVEL SECURITY;
    `;
    
    const { error } = await supabase.rpc('run_sql', { sql });
    
    if (error) {
      console.error('Error disabling RLS for development:', error);
      return false;
    }
    
    console.log('Successfully disabled RLS for development');
    return true;
  } catch (error) {
    console.error('Exception disabling RLS for development:', error);
    return false;
  }
};

// Update the setupDatabase function to include new functions
export const setupDatabase = async (
  includeSchemaSetup = true,
  includeSeedData = false
): Promise<boolean> => {
  try {
    let success = true;
    
    if (includeSchemaSetup) {
      // Create database schema
      success = await createDatabaseSchema();
      
      if (!success) {
        console.error('Failed to create database schema');
        return false;
      }
      
      // Create database functions
      success = await createClassFunction();
      
      if (!success) {
        console.error('Failed to create database functions');
        // Continue anyway, as this might not be critical
      }
      
      // Apply public access policies
      success = await applyPublicAccessPolicies();
      
      if (!success) {
        console.error('Failed to apply public access policies');
        // Continue anyway, as this might not be critical
      }
      
      // Disable RLS for development
      success = await disableRLSForDevelopment();
      
      if (!success) {
        console.error('Failed to disable RLS for development');
        // Continue anyway, as this might not be critical
      }
    }
    
    if (includeSeedData) {
      // Seed database with initial data
      success = await seedDatabase();
      
      if (!success) {
        console.error('Failed to seed database');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in setupDatabase:', error);
    return false;
  }
};
