import { supabase } from '@/lib/supabase/client';

// Function to create the database schema
export const createDatabaseSchema = async (): Promise<boolean> => {
  try {
    // SQL script to create the schema
    const sql = `
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
        { ten_lop: 'Lớp 1A' },
        { ten_lop: 'Lớp 2B' },
        { ten_lop: 'Lớp 3C' },
      ]);

    if (classesError) {
      console.error('Error seeding classes table:', classesError);
      return false;
    }

    // Insert sample data into the students table
    const { error: studentsError } = await supabase
      .from('students')
      .insert([
        { ten_hoc_sinh: 'Nguyễn Văn A', co_so_id: 'a4a5a6a7-a8a9-4a0b-8c1d-2e3f4a5a6a7a' },
        { ten_hoc_sinh: 'Trần Thị B', co_so_id: 'b4b5b6b7-b8b9-4b0b-9c1d-2e3f4b5b6b7b' },
        { ten_hoc_sinh: 'Lê Văn C', co_so_id: 'c4c5c6c7-c8c9-4c0b-ac1d-2e3f4c5c6c7c' },
      ]);

    if (studentsError) {
      console.error('Error seeding students table:', studentsError);
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
        INSERT INTO classes (
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
          class_data->>'ten_lop_full',
          class_data->>'ten_lop',
          class_data->>'ct_hoc',
          (class_data->>'co_so')::UUID,
          (class_data->>'gv_chinh')::UUID,
          (class_data->>'ngay_bat_dau')::DATE,
          class_data->>'tinh_trang',
          class_data->>'ghi_chu',
          class_data->>'unit_id'
        )
        RETURNING id INTO new_class_id;
        
        SELECT row_to_json(c)::JSONB INTO new_class
        FROM classes c
        WHERE c.id = new_class_id;
        
        RETURN new_class;
      END;
      $$;
    `;
    
    // Execute the SQL script
    const { error } = await supabase.rpc('run_sql', { sql });
    
    if (error) {
      console.error('Error creating class function:', error);
      return false;
    }
    
    console.log('Class function created successfully');
    return true;
  } catch (error) {
    console.error('Error creating class function:', error);
    return false;
  }
};

// Update the setupDatabase function to include creating the class function
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
      
      // Create class function
      success = await createClassFunction();
      
      if (!success) {
        console.error('Failed to create class function');
        // Continue anyway, as this might not be critical
      }
      
      // Apply public access policies
      success = await applyPublicAccessPolicies();
      
      if (!success) {
        console.error('Failed to apply public access policies');
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
