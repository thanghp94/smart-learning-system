import { pgTable, text, integer, serial, timestamp, decimal, boolean, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Students table
export const students = pgTable("students", {
  id: text("id").primaryKey(),
  ten_hoc_sinh: text("ten_hoc_sinh").notNull(),
  ngay_sinh: text("ngay_sinh"),
  gioi_tinh: text("gioi_tinh"),
  dia_chi: text("dia_chi"),
  so_dien_thoai: text("so_dien_thoai"),
  email: text("email"),
  ten_phu_huynh: text("ten_phu_huynh"),
  so_dien_thoai_phu_huynh: text("so_dien_thoai_phu_huynh"),
  email_phu_huynh: text("email_phu_huynh"),
  trang_thai: text("trang_thai").default("active"),
  ghi_chu: text("ghi_chu"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Facilities table
export const facilities = pgTable("facilities", {
  id: text("id").primaryKey(),
  ten_co_so: text("ten_co_so").notNull(),
  dia_chi: text("dia_chi"),
  so_dien_thoai: text("so_dien_thoai"),
  email: text("email"),
  mo_ta: text("mo_ta"),
  trang_thai: text("trang_thai").default("active"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Employees table
export const employees = pgTable("employees", {
  id: text("id").primaryKey(),
  ten_nhan_vien: text("ten_nhan_vien").notNull(),
  ten_ngan: text("ten_ngan"),
  ngay_sinh: text("ngay_sinh"),
  gioi_tinh: text("gioi_tinh"),
  dia_chi: text("dia_chi"),
  so_dien_thoai: text("so_dien_thoai"),
  email: text("email"),
  chuc_vu: text("chuc_vu"),
  bo_phan: text("bo_phan"),
  co_so: text("co_so"),
  ngay_vao_lam: text("ngay_vao_lam"),
  trang_thai: text("trang_thai").default("active"),
  hinh_anh: text("hinh_anh"),
  ghi_chu: text("ghi_chu"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Classes table
export const classes = pgTable("classes", {
  id: text("id").primaryKey(),
  ten_lop: text("ten_lop").notNull(),
  ten_lop_full: text("ten_lop_full").notNull(),
  co_so: text("co_so"),
  gv_chinh: text("gv_chinh"),
  ct_hoc: text("ct_hoc"),
  ngay_bat_dau: text("ngay_bat_dau"),
  tinh_trang: text("tinh_trang").default("active"),
  ghi_chu: text("ghi_chu"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Teaching Sessions table
export const teachingSessions = pgTable("teaching_sessions", {
  id: text("id").primaryKey(),
  class_id: text("class_id"),
  giao_vien: text("giao_vien"),
  ngay_hoc: text("ngay_hoc"),
  gio_bat_dau: text("gio_bat_dau"),
  gio_ket_thuc: text("gio_ket_thuc"),
  noi_dung: text("noi_dung"),
  ghi_chu: text("ghi_chu"),
  trang_thai: text("trang_thai").default("scheduled"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey(),
  student_id: text("student_id"),
  class_id: text("class_id"),
  ngay_dang_ky: text("ngay_dang_ky"),
  trang_thai: text("trang_thai").default("active"),
  ghi_chu: text("ghi_chu"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Attendances table
export const attendances = pgTable("attendances", {
  id: text("id").primaryKey(),
  teaching_session_id: text("teaching_session_id"),
  enrollment_id: text("enrollment_id"),
  status: text("status").default("present"),
  thoi_gian_tre: integer("thoi_gian_tre"),
  danh_gia_1: integer("danh_gia_1"),
  danh_gia_2: integer("danh_gia_2"),
  danh_gia_3: integer("danh_gia_3"),
  danh_gia_4: integer("danh_gia_4"),
  ghi_chu: text("ghi_chu"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Assets table
export const assets = pgTable("assets", {
  id: text("id").primaryKey(),
  ten_csvc: text("ten_csvc").notNull(),
  danh_muc: text("danh_muc"),
  loai: text("loai"),
  thuong_hieu: text("thuong_hieu"),
  mau: text("mau"),
  size: text("size"),
  chat_lieu: text("chat_lieu"),
  so_luong: integer("so_luong"),
  don_vi: text("don_vi").notNull(),
  facility_id: text("facility_id"),
  tinh_trang: text("tinh_trang"),
  so_tien_mua: text("so_tien_mua"),
  ngay_mua: text("ngay_mua"),
  noi_mua: text("noi_mua"),
  mo_ta_1: text("mo_ta_1"),
  ghi_chu: text("ghi_chu"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Settings table
export const settings = pgTable("settings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  hang_muc: text("hang_muc"),
  tuy_chon: text("tuy_chon"),
  mo_ta: text("mo_ta"),
  hien_thi: text("hien_thi"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Finance table
export const finances = pgTable("finances", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  amount: decimal("amount", { precision: 15, scale: 2 }),
  description: text("description"),
  transaction_type: text("transaction_type"),
  facility_id: text("facility_id"),
  student_id: text("student_id"),
  employee_id: text("employee_id"),
  payment_method: text("payment_method"),
  transaction_date: date("transaction_date"),
  created_by: text("created_by"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Finance transaction types table
export const financeTransactionTypes = pgTable("finance_transaction_types", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

// Asset transfers table
export const assetTransfers = pgTable("asset_transfers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  asset_id: text("asset_id"),
  from_facility_id: text("from_facility_id"),
  to_facility_id: text("to_facility_id"),
  transfer_date: date("transfer_date"),
  notes: text("notes"),
  transferred_by: text("transferred_by"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Activities table
export const activities = pgTable("activities", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id"),
  action: text("action"),
  table_name: text("table_name"),
  record_id: text("record_id"),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

// Images table
export const images = pgTable("images", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  file_name: text("file_name"),
  file_path: text("file_path"),
  file_size: integer("file_size"),
  mime_type: text("mime_type"),
  uploaded_by: text("uploaded_by"),
  related_id: text("related_id"),
  related_type: text("related_type"),
  created_at: timestamp("created_at").defaultNow(),
});

// Files table
export const files = pgTable("files", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  ten_file: text("ten_file"),
  file_name: text("file_name"),
  file_path: text("file_path"),
  file_size: integer("file_size"),
  mime_type: text("mime_type"),
  loai_file: text("loai_file"),
  mo_ta: text("mo_ta"),
  uploaded_by: text("uploaded_by"),
  entity_type: text("entity_type"),
  entity_id: text("entity_id"),
  is_public: boolean("is_public").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Events table
export const events = pgTable("events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  event_date: date("event_date"),
  start_time: time("start_time"),
  end_time: time("end_time"),
  location: text("location"),
  event_type: text("event_type"),
  facility_id: text("facility_id"),
  created_by: text("created_by"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Contacts table
export const contacts = pgTable("contacts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  ten_lien_he: text("ten_lien_he").notNull(),
  email: text("email"),
  so_dien_thoai: text("so_dien_thoai"),
  dia_chi: text("dia_chi"),
  loai_lien_he: text("loai_lien_he"),
  ghi_chu: text("ghi_chu"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Requests table
export const requests = pgTable("requests", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  employee_id: text("employee_id"),
  title: text("title"),
  description: text("description"),
  request_type: text("request_type"),
  status: text("status").default("pending"),
  priority: text("priority").default("medium"),
  due_date: date("due_date"),
  approved_by: text("approved_by"),
  approved_at: timestamp("approved_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  ten_viec: text("ten_viec").notNull(),
  loai_viec: text("loai_viec"),
  dien_giai: text("dien_giai"),
  nguoi_phu_trach: text("nguoi_phu_trach"),
  nguoi_tao: text("nguoi_tao"),
  ngay_den_han: date("ngay_den_han"),
  cap_do: text("cap_do").default("normal"),
  trang_thai: text("trang_thai").default("pending"),
  doi_tuong: text("doi_tuong"),
  doi_tuong_id: text("doi_tuong_id"),
  ghi_chu: text("ghi_chu"),
  ngay_hoan_thanh: timestamp("ngay_hoan_thanh"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);

// Evaluations table
export const evaluations = pgTable("evaluations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  student_id: text("student_id"),
  class_id: text("class_id"),
  evaluation_type: text("evaluation_type"),
  score: integer("score"),
  max_score: integer("max_score"),
  notes: text("notes"),
  evaluation_date: date("evaluation_date"),
  created_by: text("created_by"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Student assignments table
export const studentAssignments = pgTable("student_assignments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  student_id: text("student_id"),
  teaching_session_id: text("teaching_session_id"),
  assignment_title: text("assignment_title"),
  assignment_description: text("assignment_description"),
  due_date: date("due_date"),
  status: text("status").default("assigned"),
  score: integer("score"),
  feedback: text("feedback"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Payroll table
export const payroll = pgTable("payroll", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  employee_id: text("employee_id"),
  month: integer("month"),
  year: integer("year"),
  base_salary: decimal("base_salary", { precision: 15, scale: 2 }),
  bonuses: decimal("bonuses", { precision: 15, scale: 2 }).default("0"),
  deductions: decimal("deductions", { precision: 15, scale: 2 }).default("0"),
  total_salary: decimal("total_salary", { precision: 15, scale: 2 }),
  payment_date: date("payment_date"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Employee clock ins table
export const employeeClockIns = pgTable("employee_clock_ins", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  employee_id: text("employee_id"),
  clock_in_time: timestamp("clock_in_time"),
  clock_out_time: timestamp("clock_out_time"),
  work_date: date("work_date"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Admissions table
export const admissions = pgTable("admissions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  ten_hoc_sinh: text("ten_hoc_sinh").notNull(),
  ngay_sinh: date("ngay_sinh"),
  gioi_tinh: text("gioi_tinh"),
  dia_chi: text("dia_chi"),
  so_dien_thoai: text("so_dien_thoai"),
  email: text("email"),
  ten_phu_huynh: text("ten_phu_huynh"),
  so_dien_thoai_phu_huynh: text("so_dien_thoai_phu_huynh"),
  email_phu_huynh: text("email_phu_huynh"),
  status: text("status").default("pending"),
  notes: text("notes"),
  application_date: date("application_date").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Sessions table
export const sessionSchedules = pgTable("sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  session_name: text("session_name"),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

// Enums table
export const enums = pgTable("enums", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  category: text("category").notNull(),
  value: text("value").notNull(),
  display_text: text("display_text"),
  sort_order: integer("sort_order").default(0),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertFacilitySchema = createInsertSchema(facilities).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertTeachingSessionSchema = createInsertSchema(teachingSessions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertAttendanceSchema = createInsertSchema(attendances).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Insert schemas for new tables
export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertFinancesSchema = createInsertSchema(finances).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertFinanceTransactionTypesSchema = createInsertSchema(financeTransactionTypes).omit({
  id: true,
  created_at: true,
});

export const insertAssetTransfersSchema = createInsertSchema(assetTransfers).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertActivitiesSchema = createInsertSchema(activities).omit({
  id: true,
  created_at: true,
});

export const insertImagesSchema = createInsertSchema(images).omit({
  id: true,
  created_at: true,
});

export const insertFilesSchema = createInsertSchema(files).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertEventsSchema = createInsertSchema(events).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertContactsSchema = createInsertSchema(contacts).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertRequestsSchema = createInsertSchema(requests).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertTasksSchema = createInsertSchema(tasks).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertEvaluationsSchema = createInsertSchema(evaluations).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertStudentAssignmentsSchema = createInsertSchema(studentAssignments).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertPayrollSchema = createInsertSchema(payroll).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertEmployeeClockInsSchema = createInsertSchema(employeeClockIns).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertAdmissionsSchema = createInsertSchema(admissions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertSessionSchedulesSchema = createInsertSchema(sessionSchedules).omit({
  id: true,
  created_at: true,
});

export const insertEnumsSchema = createInsertSchema(enums).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilities.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertTeachingSession = z.infer<typeof insertTeachingSessionSchema>;
export type TeachingSession = typeof teachingSessions.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendances.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;

// New table types
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertFinances = z.infer<typeof insertFinancesSchema>;
export type Finances = typeof finances.$inferSelect;
export type InsertFinanceTransactionTypes = z.infer<typeof insertFinanceTransactionTypesSchema>;
export type FinanceTransactionTypes = typeof financeTransactionTypes.$inferSelect;
export type InsertAssetTransfers = z.infer<typeof insertAssetTransfersSchema>;
export type AssetTransfers = typeof assetTransfers.$inferSelect;
export type InsertActivities = z.infer<typeof insertActivitiesSchema>;
export type Activities = typeof activities.$inferSelect;
export type InsertImages = z.infer<typeof insertImagesSchema>;
export type Images = typeof images.$inferSelect;
export type InsertFiles = z.infer<typeof insertFilesSchema>;
export type Files = typeof files.$inferSelect;
export type InsertEvents = z.infer<typeof insertEventsSchema>;
export type Events = typeof events.$inferSelect;
export type InsertContacts = z.infer<typeof insertContactsSchema>;
export type Contacts = typeof contacts.$inferSelect;
export type InsertRequests = z.infer<typeof insertRequestsSchema>;
export type Requests = typeof requests.$inferSelect;
export type InsertTasks = z.infer<typeof insertTasksSchema>;
export type Tasks = typeof tasks.$inferSelect;
export type InsertEvaluations = z.infer<typeof insertEvaluationsSchema>;
export type Evaluations = typeof evaluations.$inferSelect;
export type InsertStudentAssignments = z.infer<typeof insertStudentAssignmentsSchema>;
export type StudentAssignments = typeof studentAssignments.$inferSelect;
export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
export type Payroll = typeof payroll.$inferSelect;
export type InsertEmployeeClockIns = z.infer<typeof insertEmployeeClockInsSchema>;
export type EmployeeClockIns = typeof employeeClockIns.$inferSelect;
export type InsertAdmissions = z.infer<typeof insertAdmissionsSchema>;
export type Admissions = typeof admissions.$inferSelect;
export type InsertSessionSchedules = z.infer<typeof insertSessionSchedulesSchema>;
export type SessionSchedules = typeof sessionSchedules.$inferSelect;
export type InsertEnums = z.infer<typeof insertEnumsSchema>;
export type Enums = typeof enums.$inferSelect;