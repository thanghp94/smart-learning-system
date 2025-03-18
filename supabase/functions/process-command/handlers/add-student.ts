
import { supabaseClient } from "../../_shared/supabase-client.ts";

export async function handleAddStudent(entities: any) {
  console.log('Adding student with entities:', entities);
  
  try {
    // Extract student data from entities
    const studentData = {
      ten_hoc_sinh: entities.student_name,
      sdt_ph1: entities.phone || '',
      ten_PH: entities.parent_name || '',
      email_ph1: entities.email || '',
      trang_thai: 'active',
    };

    // Insert student data into the database
    const { data, error } = await supabaseClient
      .from('students')
      .insert(studentData)
      .select();

    if (error) {
      console.error('Error inserting student:', error);
      return {
        success: false,
        message: `Lỗi khi thêm học sinh: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `Đã thêm học sinh ${entities.student_name} thành công.`,
      data: data
    };
  } catch (error) {
    console.error('Error in handleAddStudent:', error);
    return {
      success: false,
      message: `Lỗi khi thêm học sinh: ${error.message}`,
    };
  }
}
