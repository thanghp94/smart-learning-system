
// This file re-exports all services from the new structure for backward compatibility
// Consider updating imports in your components to use the new structure directly

// Import services
import teachingSessionService from './teaching-session-service';
import { classService } from './services/class';
import { employeeService } from './employee-service';
import { facilityService } from './facility-service';
import { studentService } from './student-service';
import { enrollmentService } from './enrollment-service';
import { taskService } from './task-service';
import { contactService } from './contact-service';
import { fileService } from './file-service';
import { financeService } from './finance-service';
import { payrollService } from './payroll-service';
import { requestService } from './request-service';
import { eventService } from './event-service';
import { imageService } from './image-service';
import { assetService } from './asset-service';
import { assetTransferService } from './asset-transfer-service';
import { evaluationService } from './evaluation-service';
import { attendanceService } from './attendance-service';
import { employeeClockInService } from './employee-clock-in-service';

// Export all services
export {
  teachingSessionService,
  classService,
  employeeService,
  facilityService,
  studentService,
  enrollmentService,
  taskService,
  contactService,
  fileService,
  financeService,
  payrollService,
  requestService,
  eventService,
  imageService,
  assetService,
  assetTransferService,
  evaluationService,
  attendanceService,
  employeeClockInService
};

// Export client for backwards compatibility
export * from './client';
