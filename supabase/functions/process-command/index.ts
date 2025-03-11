
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY in your Supabase project.');
    }

    const { command } = await req.json();
    
    if (!command) {
      throw new Error('No command provided');
    }

    console.log('Processing command:', command);

    // Step 1: First, analyze the command to determine the intent and extract entities
    const analyzeResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an assistant that analyzes commands for a school management system.
            Extract the intent and entities from the command.
            Return ONLY a JSON object with the following structure:
            {
              "intent": "<one of: add_student, send_email, update_student, schedule_class, check_info, other>",
              "confidence": <number between 0 and 1>,
              "entities": {
                "student_name": "<student name if present>",
                "parent_name": "<parent name if present>",
                "phone": "<phone number if present>",
                "email": "<email if present>",
                "class": "<class if present>",
                "subject": "<email subject if it's an email command>",
                "message": "<email message or additional details>"
              }
            }
            Do not include any explanations or additional text, just the JSON.`
          },
          { role: 'user', content: command }
        ],
        temperature: 0.1,
      }),
    });

    const analysisData = await analyzeResponse.json();
    const analysisResult = analysisData.choices[0]?.message?.content || '';
    
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysisResult);
      console.log('Parsed analysis:', parsedAnalysis);
    } catch (e) {
      console.error('Error parsing analysis result:', e);
      console.log('Raw analysis result:', analysisResult);
      throw new Error('Failed to parse command analysis');
    }

    // Step 2: Execute the appropriate action based on the intent
    let result;
    switch (parsedAnalysis.intent) {
      case 'add_student':
        result = await handleAddStudent(parsedAnalysis.entities);
        break;
      case 'send_email':
        result = await handleSendEmail(parsedAnalysis.entities);
        break;
      case 'update_student':
        result = await handleUpdateStudent(parsedAnalysis.entities);
        break;
      case 'check_info':
        result = await handleCheckInfo(parsedAnalysis.entities);
        break;
      default:
        result = {
          success: false,
          message: 'Không hiểu lệnh này. Vui lòng thử lại với câu lệnh rõ ràng hơn.'
        };
    }

    // Step 3: Generate a human-friendly response
    const responseText = await generateResponse(parsedAnalysis, result);
    
    return new Response(JSON.stringify({ 
      result,
      parsedCommand: parsedAnalysis,
      responseText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in process-command function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions for each intent
async function handleAddStudent(entities: any) {
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

async function handleSendEmail(entities: any) {
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

async function handleUpdateStudent(entities: any) {
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

async function handleCheckInfo(entities: any) {
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

async function generateResponse(analysis: any, result: any) {
  try {
    // Use OpenAI to generate a friendly response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `Bạn là một trợ lý ảo hỗ trợ quản lý trường học.
            Hãy tạo một phản hồi ngắn gọn, thân thiện về kết quả của hành động được yêu cầu.
            Phản hồi bằng tiếng Việt, ngắn gọn (dưới 100 từ).`
          },
          { 
            role: 'user', 
            content: `Lệnh được phân tích: ${JSON.stringify(analysis)}
            Kết quả thực hiện: ${JSON.stringify(result)}
            Hãy tạo phản hồi phù hợp.`
          }
        ],
        temperature: 0.7,
      }),
    });

    const responseData = await response.json();
    const responseText = responseData.choices[0]?.message?.content || '';
    
    return responseText;
  } catch (error) {
    console.error('Error generating response:', error);
    return result.success 
      ? `Đã thực hiện thành công: ${result.message}`
      : `Không thể thực hiện: ${result.message}`;
  }
}
