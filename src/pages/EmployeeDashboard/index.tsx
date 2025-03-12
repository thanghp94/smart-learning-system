
// Update the line with getAttendanceForEmployee to include all required arguments
const today = new Date().toISOString().split('T')[0];
const userAttendance = await employeeClockInService.getAttendanceForEmployee(
  currentUser.id,
  today,
  'all' // Add missing argument
);
