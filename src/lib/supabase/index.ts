
// Client
export { supabase } from './client';

// Base service functions
export {
  fetchAll,
  fetchById,
  insert,
  update,
  remove,
  logActivity
} from './base-service';

// Entity services
export { studentService } from './student-service';
export { classService } from './class-service';
export { teachingSessionService } from './teaching-session-service';
export { employeeService } from './employee-service';
export { facilityService } from './facility-service';
export { enrollmentService } from './enrollment-service';
export { assetService } from './asset-service';
export { assetTransferService } from './asset-transfer-service';
export { storageService } from './storage-service';
export { taskService } from './task-service';

// Basic services
export {
  sessionService,
  eventService,
  imageService,
  settingService,
  payrollService,
  financeService,
  evaluationService,
  fileService,
  requestService,
  contactService
} from './basic-services';
