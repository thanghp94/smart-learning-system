
import { supabaseClient } from "../../_shared/supabase-client.ts";

export async function handleSendEmail(entities: any) {
  console.log('Sending email with entities:', entities);
  
  try {
    // First, try to find the student/parent email
    let recipientEmail = entities.email;
    
    if (!recipientEmail && entities.student_name) {
      // Look up student to get parent email
      const { data: students, error } = await supabaseClient
        .from('students')
        .select('email_ph1, ten_PH')
        .ilike('ten_hoc_sinh', `%${entities.student_name}%`)
        .limit(1);
      
      if (error) {
        throw new Error(`Không thể tìm thấy thông tin học sinh: ${error.message}`);
      }
      
      if (students && students.length > 0) {
        recipientEmail = students[0].email_ph1;
      }
    }
    
    if (!recipientEmail) {
      return {
        success: false,
        message: 'Không tìm thấy địa chỉ email để gửi.',
      };
    }

    // We'd call an email sending service here in production
    // For now, we'll just simulate it
    console.log(`Đang gửi email tới: ${recipientEmail}`);
    console.log(`Tiêu đề: ${entities.subject || 'Thông báo từ hệ thống'}`);
    console.log(`Nội dung: ${entities.message || ''}`);
    
    // In production, here we would call another edge function to send the email
    
    return {
      success: true,
      message: `Đã gửi email tới ${recipientEmail}.`,
      simulatedEmail: {
        to: recipientEmail,
        subject: entities.subject || 'Thông báo từ hệ thống',
        message: entities.message || ''
      }
    };
  } catch (error) {
    console.error('Error in handleSendEmail:', error);
    return {
      success: false,
      message: `Lỗi khi gửi email: ${error.message}`,
    };
  }
}
