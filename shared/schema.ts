import { pgTable, text, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
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
  ngay_sinh: text("ngay_sinh"),
  gioi_tinh: text("gioi_tinh"),
  dia_chi: text("dia_chi"),
  so_dien_thoai: text("so_dien_thoai"),
  email: text("email"),
  chuc_vu: text("chuc_vu"),
  bo_phan: text("bo_phan"),
  ngay_vao_lam: text("ngay_vao_lam"),
  trang_thai: text("trang_thai").default("active"),
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

// Additional tables that are referenced in the codebase
export const settings = pgTable("settings", {
  id: text("id").primaryKey(),
  hang_muc: text("hang_muc"),
  tuy_chon: text("tuy_chon"),
  mo_ta: text("mo_ta"),
  hien_thi: text("hien_thi"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const finances = pgTable("finances", {
  id: text("id").primaryKey(),
  amount: text("amount"), // Using text for decimal values
  description: text("description"),
  transaction_type: text("transaction_type"),
  facility_id: text("facility_id"),
  student_id: text("student_id"),
  employee_id: text("employee_id"),
  payment_method: text("payment_method"),
  transaction_date: text("transaction_date"),
  created_by: text("created_by"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  user_id: text("user_id"),
  action: text("action"),
  table_name: text("table_name"),
  record_id: text("record_id"),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

export const images = pgTable("images", {
  id: text("id").primaryKey(),
  file_name: text("file_name"),
  file_path: text("file_path"),
  file_size: integer("file_size"),
  mime_type: text("mime_type"),
  uploaded_by: text("uploaded_by"),
  related_id: text("related_id"),
  related_type: text("related_type"),
  created_at: timestamp("created_at").defaultNow(),
});

export const files = pgTable("files", {
  id: text("id").primaryKey(),
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
  is_public: text("is_public"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const requests = pgTable("requests", {
  id: text("id").primaryKey(),
  employee_id: text("employee_id"),
  title: text("title"),
  description: text("description"),
  request_type: text("request_type"),
  status: text("status").default("pending"),
  priority: text("priority").default("medium"),
  due_date: text("due_date"),
  approved_by: text("approved_by"),
  approved_at: timestamp("approved_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  assigned_to: text("assigned_to"),
  assigned_by: text("assigned_by"),
  status: text("status").default("pending"),
  priority: text("priority").default("medium"),
  due_date: text("due_date"),
  completed_at: timestamp("completed_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const admissions = pgTable("admissions", {
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
  status: text("status").default("pending"),
  notes: text("notes"),
  application_date: text("application_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Insert schemas for new tables
export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertFinanceSchema = createInsertSchema(finances).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertAdmissionSchema = createInsertSchema(admissions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Export types for new tables
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Finance = typeof finances.$inferSelect;
export type InsertFinance = z.infer<typeof insertFinanceSchema>;
export type Admission = typeof admissions.$inferSelect;
export type InsertAdmission = z.infer<typeof insertAdmissionSchema>;
export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
