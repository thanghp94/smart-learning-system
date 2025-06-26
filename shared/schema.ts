import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Students table
export const students = sqliteTable("students", {
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
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

// Facilities table
export const facilities = sqliteTable("facilities", {
  id: text("id").primaryKey(),
  ten_co_so: text("ten_co_so").notNull(),
  dia_chi: text("dia_chi"),
  so_dien_thoai: text("so_dien_thoai"),
  email: text("email"),
  mo_ta: text("mo_ta"),
  trang_thai: text("trang_thai").default("active"),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

// Employees table
export const employees = sqliteTable("employees", {
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
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

// Classes table
export const classes = sqliteTable("classes", {
  id: text("id").primaryKey(),
  ten_lop: text("ten_lop").notNull(),
  ten_lop_full: text("ten_lop_full").notNull(),
  co_so: text("co_so"),
  gv_chinh: text("gv_chinh"),
  ct_hoc: text("ct_hoc"),
  ngay_bat_dau: text("ngay_bat_dau"),
  tinh_trang: text("tinh_trang").default("active"),
  ghi_chu: text("ghi_chu"),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

// Teaching Sessions table
export const teachingSessions = sqliteTable("teaching_sessions", {
  id: text("id").primaryKey(),
  class_id: text("class_id"),
  giao_vien: text("giao_vien"),
  ngay_hoc: text("ngay_hoc"),
  gio_bat_dau: text("gio_bat_dau"),
  gio_ket_thuc: text("gio_ket_thuc"),
  noi_dung: text("noi_dung"),
  ghi_chu: text("ghi_chu"),
  trang_thai: text("trang_thai").default("scheduled"),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

// Enrollments table
export const enrollments = sqliteTable("enrollments", {
  id: text("id").primaryKey(),
  student_id: text("student_id"),
  class_id: text("class_id"),
  ngay_dang_ky: text("ngay_dang_ky"),
  trang_thai: text("trang_thai").default("active"),
  ghi_chu: text("ghi_chu"),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

// Attendances table
export const attendances = sqliteTable("attendances", {
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
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

// Assets table
export const assets = sqliteTable("assets", {
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
  created_at: text("created_at"),
  updated_at: text("updated_at"),
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
