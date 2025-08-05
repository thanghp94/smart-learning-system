import { StudentStorage } from "./students";
import { EmployeeStorage } from "./employees";
import { ClassStorage } from "./classes";
import { TeachingSessionStorage } from "./teachingSessions";
import { AssetStorage } from "./assets";
import { FileStorage } from "./files";
import { ContactStorage } from "./contacts";
import { RequestStorage } from "./requests";
import { EvaluationStorage } from "./evaluations";
import { PayrollStorage } from "./payroll";
import { AdmissionStorage } from "./admissions";
import { ImageStorage } from "./images";
import { EmployeeClockInStorage } from "./employeeClockIn";
import { FacilityStorage } from "./facilities";

import type { IStorage } from "../storage";

export class DatabaseStorage implements IStorage {
  private studentStorage = new StudentStorage();
  private employeeStorage = new EmployeeStorage();
  private classStorage = new ClassStorage();
  private teachingSessionStorage = new TeachingSessionStorage();
  private assetStorage = new AssetStorage();
  private fileStorage = new FileStorage();
  private contactStorage = new ContactStorage();
  private requestStorage = new RequestStorage();
  private evaluationStorage = new EvaluationStorage();
  private payrollStorage = new PayrollStorage();
  private admissionStorage = new AdmissionStorage();
  private imageStorage = new ImageStorage();
  private employeeClockInStorage = new EmployeeClockInStorage();
  private facilityStorage = new FacilityStorage();

  // Students
  getStudents = this.studentStorage.getStudents.bind(this.studentStorage);
  getStudent = this.studentStorage.getStudent.bind(this.studentStorage);
  createStudent = this.studentStorage.createStudent.bind(this.studentStorage);
  updateStudent = this.studentStorage.updateStudent.bind(this.studentStorage);
  deleteStudent = this.studentStorage.deleteStudent.bind(this.studentStorage);

  // Employees
  getEmployees = this.employeeStorage.getEmployees.bind(this.employeeStorage);
  getEmployee = this.employeeStorage.getEmployee.bind(this.employeeStorage);
  createEmployee = this.employeeStorage.createEmployee.bind(this.employeeStorage);
  updateEmployee = this.employeeStorage.updateEmployee.bind(this.employeeStorage);
  deleteEmployee = this.employeeStorage.deleteEmployee.bind(this.employeeStorage);

  // Classes
  getClasses = this.classStorage.getClasses.bind(this.classStorage);
  getClass = this.classStorage.getClass.bind(this.classStorage);
  createClass = this.classStorage.createClass.bind(this.classStorage);
  updateClass = this.classStorage.updateClass.bind(this.classStorage);
  deleteClass = this.classStorage.deleteClass.bind(this.classStorage);

  // Teaching Sessions
  getTeachingSessions = this.teachingSessionStorage.getTeachingSessions.bind(this.teachingSessionStorage);
  getTeachingSession = this.teachingSessionStorage.getTeachingSession.bind(this.teachingSessionStorage);
  createTeachingSession = this.teachingSessionStorage.createTeachingSession.bind(this.teachingSessionStorage);
  updateTeachingSession = this.teachingSessionStorage.updateTeachingSession.bind(this.teachingSessionStorage);
  deleteTeachingSession = this.teachingSessionStorage.deleteTeachingSession.bind(this.teachingSessionStorage);

  // Assets
  getAssets = this.assetStorage.getAssets.bind(this.assetStorage);
  getAsset = this.assetStorage.getAsset.bind(this.assetStorage);
  createAsset = this.assetStorage.createAsset.bind(this.assetStorage);
  updateAsset = this.assetStorage.updateAsset.bind(this.assetStorage);
  deleteAsset = this.assetStorage.deleteAsset.bind(this.assetStorage);

  // Asset Transfers
  getAssetTransfers = this.assetStorage.getAssetTransfers.bind(this.assetStorage);
  getAssetTransfer = this.assetStorage.getAssetTransfer.bind(this.assetStorage);
  createAssetTransfer = this.assetStorage.createAssetTransfer.bind(this.assetStorage);
  updateAssetTransfer = this.assetStorage.updateAssetTransfer.bind(this.assetStorage);
  deleteAssetTransfer = this.assetStorage.deleteAssetTransfer.bind(this.assetStorage);

  // Files
  getFiles = this.fileStorage.getFiles.bind(this.fileStorage);
  getFile = this.fileStorage.getFile.bind(this.fileStorage);
  createFile = this.fileStorage.createFile.bind(this.fileStorage);
  updateFile = this.fileStorage.updateFile.bind(this.fileStorage);
  deleteFile = this.fileStorage.deleteFile.bind(this.fileStorage);

  // Contacts
  getContacts = this.contactStorage.getContacts.bind(this.contactStorage);
  getContact = this.contactStorage.getContact.bind(this.contactStorage);
  createContact = this.contactStorage.createContact.bind(this.contactStorage);
  updateContact = this.contactStorage.updateContact.bind(this.contactStorage);
  deleteContact = this.contactStorage.deleteContact.bind(this.contactStorage);

  // Requests
  getRequests = this.requestStorage.getRequests.bind(this.requestStorage);
  getRequest = this.requestStorage.getRequest.bind(this.requestStorage);
  createRequest = this.requestStorage.createRequest.bind(this.requestStorage);
  updateRequest = this.requestStorage.updateRequest.bind(this.requestStorage);
  deleteRequest = this.requestStorage.deleteRequest.bind(this.requestStorage);

  // Evaluations
  getEvaluations = this.evaluationStorage.getEvaluations.bind(this.evaluationStorage);
  getEvaluation = this.evaluationStorage.getEvaluation.bind(this.evaluationStorage);
  createEvaluation = this.evaluationStorage.createEvaluation.bind(this.evaluationStorage);
  updateEvaluation = this.evaluationStorage.updateEvaluation.bind(this.evaluationStorage);
  deleteEvaluation = this.evaluationStorage.deleteEvaluation.bind(this.evaluationStorage);

  // Payroll
  getPayroll = this.payrollStorage.getPayrolls.bind(this.payrollStorage);
  getPayrollById = this.payrollStorage.getPayroll.bind(this.payrollStorage);
  getPayrollByMonth = async (month: number, year: number) => {
    // This would need to be implemented in PayrollStorage
    return [];
  };
  createPayroll = this.payrollStorage.createPayroll.bind(this.payrollStorage);
  updatePayroll = this.payrollStorage.updatePayroll.bind(this.payrollStorage);
  deletePayroll = this.payrollStorage.deletePayroll.bind(this.payrollStorage);

  // Admissions
  getAdmissions = this.admissionStorage.getAdmissions.bind(this.admissionStorage);
  getAdmission = this.admissionStorage.getAdmission.bind(this.admissionStorage);
  createAdmission = this.admissionStorage.createAdmission.bind(this.admissionStorage);
  updateAdmission = this.admissionStorage.updateAdmission.bind(this.admissionStorage);
  deleteAdmission = this.admissionStorage.deleteAdmission.bind(this.admissionStorage);

  // Images
  getImages = this.imageStorage.getImages.bind(this.imageStorage);
  getImage = this.imageStorage.getImage.bind(this.imageStorage);
  createImage = this.imageStorage.createImage.bind(this.imageStorage);
  updateImage = this.imageStorage.updateImage.bind(this.imageStorage);
  deleteImage = this.imageStorage.deleteImage.bind(this.imageStorage);

  // Employee Clock Ins
  getEmployeeClockIn = this.employeeClockInStorage.getEmployeeClockIns.bind(this.employeeClockInStorage);
  getEmployeeClockInById = this.employeeClockInStorage.getEmployeeClockIn.bind(this.employeeClockInStorage);
  getEmployeeClockInByMonth = async (month: number, year: number) => {
    // This would need to be implemented in EmployeeClockInStorage
    return [];
  };
  createEmployeeClockIn = this.employeeClockInStorage.createEmployeeClockIn.bind(this.employeeClockInStorage);
  updateEmployeeClockIn = this.employeeClockInStorage.updateEmployeeClockIn.bind(this.employeeClockInStorage);
  deleteEmployeeClockIn = this.employeeClockInStorage.deleteEmployeeClockIn.bind(this.employeeClockInStorage);
  // Missing methods from IStorage interface
  async getUser(id: number) {
    // This would need to be implemented
    return undefined;
  }

  async getUserByUsername(username: string) {
    // This would need to be implemented
    return undefined;
  }

  async createUser(user: any) {
    // This would need to be implemented
    return {} as any;
  }

  // Facilities
  getFacilitys = this.facilityStorage.getFacilitys.bind(this.facilityStorage);
  getFacility = this.facilityStorage.getFacility.bind(this.facilityStorage);
  createFacility = this.facilityStorage.createFacility.bind(this.facilityStorage);
  updateFacility = this.facilityStorage.updateFacility.bind(this.facilityStorage);
  deleteFacility = this.facilityStorage.deleteFacility.bind(this.facilityStorage);

  async getEnrollments() {
    // This would need to be implemented
    return [];
  }

  async getEnrollment(id: string) {
    // This would need to be implemented
    return undefined;
  }

  async createEnrollment(enrollment: any) {
    // This would need to be implemented
    return {} as any;
  }

  async updateEnrollment(id: string, enrollment: any) {
    // This would need to be implemented
    return undefined;
  }

  async deleteEnrollment(id: string) {
    // This would need to be implemented
    return false;
  }

  async getAttendances() {
    // This would need to be implemented
    return [];
  }

  async getAttendance(id: string) {
    // This would need to be implemented
    return undefined;
  }

  async createAttendance(attendance: any) {
    // This would need to be implemented
    return {} as any;
  }

  async updateAttendance(id: string, attendance: any) {
    // This would need to be implemented
    return undefined;
  }

  async deleteAttendance(id: string) {
    // This would need to be implemented
    return false;
  }

  async getTasks() {
    // This would need to be implemented
    return [];
  }

  async getTask(id: string) {
    // This would need to be implemented
    return undefined;
  }

  async createTask(task: any) {
    // This would need to be implemented
    return {} as any;
  }

  async updateTask(id: string, task: any) {
    // This would need to be implemented
    return undefined;
  }

  async deleteTask(id: string) {
    // This would need to be implemented
    return false;
  }

  async executeQuery(query: string) {
    // This would need to be implemented
    return {};
  }
}

export const storage = new DatabaseStorage();
