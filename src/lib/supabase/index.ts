
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
export { assetTransferService } from './asset-transfer-service';
export { storageService } from './storage-service';

// Basic services
export {
  sessionService,
  eventService,
  taskService,
  imageService,
  settingService,
  payrollService,
  financeService,
  evaluationService,
  fileService,
  assetService,
  requestService,
  contactService
} from './basic-services';
