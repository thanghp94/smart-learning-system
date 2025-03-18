
import { supabaseClient } from "../../_shared/supabase-client.ts";

export async function handleUpdateStudent(entities: any) {
  console.log('Updating student with entities:', entities);
  
  try {
    if (!entities.student_name) {
      return {
        success: false,
        message: 'Không tìm thấy tên học sinh để cập nhật.',
      };
    }

    // Look up student first
    const { data: students, error: findError } = await supabaseClient
      .from('students')
      .select('id, ten_hoc_sinh')
      .ilike('ten_hoc_sinh', `%${entities.student_name}%`)
      .limit(1);
    
    if (findError) {
      throw new Error(`Không thể tìm thấy học sinh: ${findError.message}`);
    }
    
    if (!students || students.length === 0) {
      return {
        success: false,
        message: `Không tìm thấy học sinh có tên ${entities.student_name}.`,
      };
    }

    const studentId = students[0].id;
    
    // Prepare update data
    const updateData: Record<string, any> = {};
    
    if (entities.phone) updateData.sdt_ph1 = entities.phone;
    if (entities.parent_name) updateData.ten_PH = entities.parent_name;
    if (entities.email) updateData.email_ph1 = entities.email;
    
    // Only update if we have data to update
    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        message: 'Không có thông tin nào để cập nhật.',
      };
    }

    // Update student
    const { data, error } = await supabaseClient
      .from('students')
      .update(updateData)
      .eq('id', studentId)
      .select();

    if (error) {
      throw new Error(`Lỗi khi cập nhật thông tin học sinh: ${error.message}`);
    }

    return {
      success: true,
      message: `Đã cập nhật thông tin học sinh ${entities.student_name} thành công.`,
      data: data
    };
  } catch (error) {
    console.error('Error in handleUpdateStudent:', error);
    return {
      success: false,
      message: `Lỗi khi cập nhật học sinh: ${error.message}`,
    };
  }
}
