const fs = require('fs');
const path = require('path');

// Mapping of service.getAll() to correct method calls
const serviceMappings = {
  'studentService.getAll()': 'studentService.getStudents()',
  'employeeService.getAll()': 'employeeService.getEmployees()',
  'classService.getAll()': 'classService.getClasses()',
  'facilityService.getAll()': 'facilityService.getFacilities()',
  'contactService.getAll()': 'contactService.getContacts()',
  'assetService.getAll()': 'assetService.getAssets()',
  'eventService.getAll()': 'eventService.getEvents()',
  'taskService.getAll()': 'taskService.getTasks()',
  'fileService.getAll()': 'fileService.getFiles()',
  'imageService.getAll()': 'imageService.getImages()',
  'payrollService.getAll()': 'payrollService.getPayroll()',
  'financeService.getAll()': 'financeService.getFinances()',
  'admissionService.getAll()': 'admissionService.getAdmissions()',
  'enrollmentService.getAll()': 'enrollmentService.getEnrollments()',
  'evaluationService.getAll()': 'evaluationService.getEvaluations()',
  'sessionService.getAll()': 'sessionService.getTeachingSessions()',
  'employeeClockInService.getAll()': 'employeeClockInService.getEmployeeClockIns()',
  'assetTransferService.getAll()': 'assetTransferService.getAssetTransfers()'
};

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace each mapping
    for (const [oldCall, newCall] of Object.entries(serviceMappings)) {
      if (content.includes(oldCall)) {
        content = content.replace(new RegExp(oldCall.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newCall);
        modified = true;
        console.log(`Fixed ${oldCall} -> ${newCall} in ${filePath}`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(filePath);
    }
  }
}

// Start from client/src directory
const startDir = path.join(__dirname, 'client', 'src');
console.log(`Starting to fix API calls in: ${startDir}`);
walkDirectory(startDir);
console.log('Finished fixing API calls!');
