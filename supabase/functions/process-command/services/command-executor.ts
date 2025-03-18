
import { supabaseClient } from "../../_shared/supabase-client.ts";
import { handleAddStudent } from "../handlers/add-student.ts";
import { handleSendEmail } from "../handlers/send-email.ts";
import { handleUpdateStudent } from "../handlers/update-student.ts";
import { handleCheckInfo } from "../handlers/check-info.ts";

export async function executeCommand(parsedAnalysis: any) {
  console.log('Executing command with intent:', parsedAnalysis.intent);
  
  switch (parsedAnalysis.intent) {
    case 'add_student':
      return await handleAddStudent(parsedAnalysis.entities);
    case 'send_email':
      return await handleSendEmail(parsedAnalysis.entities);
    case 'update_student':
      return await handleUpdateStudent(parsedAnalysis.entities);
    case 'check_info':
      return await handleCheckInfo(parsedAnalysis.entities);
    default:
      return {
        success: false,
        message: 'Không hiểu lệnh này. Vui lòng thử lại với câu lệnh rõ ràng hơn.'
      };
  }
}
