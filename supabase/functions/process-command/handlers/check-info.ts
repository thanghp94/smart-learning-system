
import { supabaseClient } from "../../_shared/supabase-client.ts";

export async function handleCheckInfo(entities: any) {
  console.log('Checking info with entities:', entities);
  
  try {
    if (!entities.student_name) {
      return {
        success: false,
        message: 'Vui lòng cung cấp tên học sinh để kiểm tra thông tin.',
      };
    }

    // Look up student
    const { data: students, error } = await supabaseClient
      .from('students')
      .select('*')
      .ilike('ten_hoc_sinh', `%${entities.student_name}%`)
      .limit(1);
    
    if (error) {
      throw new Error(`Không thể tìm kiếm học sinh: ${error.message}`);
    }
    
    if (!students || students.length === 0) {
      return {
        success: false,
        message: `Không tìm thấy học sinh có tên ${entities.student_name}.`,
      };
    }

    return {
      success: true,
      message: `Đã tìm thấy thông tin học sinh ${students[0].ten_hoc_sinh}.`,
      data: students[0]
    };
  } catch (error) {
    console.error('Error in handleCheckInfo:', error);
    return {
      success: false,
      message: `Lỗi khi kiểm tra thông tin: ${error.message}`,
    };
  }
}
