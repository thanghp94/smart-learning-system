
// Import services from their correct locations
import { classService } from '@/lib/supabase/services/class';
import { studentService } from '@/lib/supabase/student-service';
import { employeeService } from '@/lib/supabase/employee-service';
import { facilityService } from '@/lib/supabase/facility-service';
import { teachingSessionService } from '@/lib/supabase/teaching-session-service';
import { enrollmentService } from '@/lib/supabase/enrollment-service';
import { assetService } from '@/lib/supabase/asset-service';
import { contactService } from '@/lib/supabase/contact-service';
import { eventService } from '@/lib/supabase/event-service';
import { taskService } from '@/lib/supabase/task-service';
import { financeService } from '@/lib/supabase/finance-service';
import { fileService } from '@/lib/supabase/file-service';
import { attendanceService } from '@/lib/supabase/attendance-service';
import { settingService } from '@/lib/supabase/setting-service';
import { employeeClockInService } from '@/lib/supabase/employee-clock-in-service';
import { imageService } from '@/lib/supabase/image-service';
import { payrollService } from '@/lib/supabase/payroll-service';
import { requestService } from '@/lib/supabase/request-service';
import { evaluationService } from '@/lib/supabase/evaluation-service';
import { assetTransferService } from '@/lib/supabase/asset-transfer-service';

// Re-export services for backward compatibility
export {
  classService,
  studentService,
  employeeService,
  facilityService,
  teachingSessionService,
  enrollmentService,
  assetService,
  contactService,
  eventService,
  taskService,
  financeService,
  fileService,
  attendanceService,
  settingService,
  employeeClockInService,
  imageService,
  payrollService,
  requestService,
  evaluationService,
  assetTransferService
};
