import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler";

// Validation rule types
export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'date' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  allowEmpty?: boolean;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validator class
class Validator {
  private validateField(value: any, rule: ValidationRule): string[] {
    const errors: string[] = [];
    const { field, required, type, minLength, maxLength, min, max, pattern, custom, allowEmpty } = rule;

    // Check if field is required
    if (required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(`${field} is required`);
      return errors;
    }

    // Skip validation if field is empty and not required
    if (!required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === '' && !allowEmpty))) {
      return errors;
    }

    // Type validation
    if (type && value !== undefined && value !== null) {
      switch (type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${field} must be a string`);
          }
          break;
        case 'number':
          if (typeof value !== 'number' && !Number.isFinite(Number(value))) {
            errors.push(`${field} must be a number`);
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`${field} must be a boolean`);
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof value !== 'string' || !emailRegex.test(value)) {
            errors.push(`${field} must be a valid email address`);
          }
          break;
        case 'date':
          if (!(value instanceof Date) && isNaN(Date.parse(value))) {
            errors.push(`${field} must be a valid date`);
          }
          break;
        case 'array':
          if (!Array.isArray(value)) {
            errors.push(`${field} must be an array`);
          }
          break;
        case 'object':
          if (typeof value !== 'object' || Array.isArray(value)) {
            errors.push(`${field} must be an object`);
          }
          break;
      }
    }

    // String length validation
    if (typeof value === 'string') {
      if (minLength !== undefined && value.length < minLength) {
        errors.push(`${field} must be at least ${minLength} characters long`);
      }
      if (maxLength !== undefined && value.length > maxLength) {
        errors.push(`${field} must be no more than ${maxLength} characters long`);
      }
    }

    // Number range validation
    if (typeof value === 'number' || (type === 'number' && Number.isFinite(Number(value)))) {
      const numValue = typeof value === 'number' ? value : Number(value);
      if (min !== undefined && numValue < min) {
        errors.push(`${field} must be at least ${min}`);
      }
      if (max !== undefined && numValue > max) {
        errors.push(`${field} must be no more than ${max}`);
      }
    }

    // Pattern validation
    if (pattern && typeof value === 'string' && !pattern.test(value)) {
      errors.push(`${field} format is invalid`);
    }

    // Custom validation
    if (custom) {
      const customResult = custom(value);
      if (customResult !== true) {
        errors.push(typeof customResult === 'string' ? customResult : `${field} is invalid`);
      }
    }

    return errors;
  }

  validate(data: any, rules: ValidationRule[]): ValidationResult {
    const errors: string[] = [];

    for (const rule of rules) {
      const fieldErrors = this.validateField(data[rule.field], rule);
      errors.push(...fieldErrors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create validator instance
const validator = new Validator();

// Validation middleware factory
export const validateRequest = (rules: ValidationRule[], target: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[target];
    const result = validator.validate(data, rules);

    if (!result.isValid) {
      throw new ApiError(`Validation failed: ${result.errors.join(', ')}`, 400);
    }

    next();
  };
};

// Common validation rules
export const commonRules = {
  id: { field: 'id', required: true, type: 'string' as const, minLength: 1 },
  name: { field: 'name', required: true, type: 'string' as const, minLength: 1, maxLength: 255 },
  email: { field: 'email', required: true, type: 'email' as const },
  phone: { 
    field: 'phone', 
    type: 'string' as const, 
    pattern: /^[\+]?[1-9][\d]{0,15}$/ 
  },
  date: { field: 'date', type: 'date' as const },
  status: { 
    field: 'status', 
    type: 'string' as const,
    custom: (value: string) => ['active', 'inactive', 'pending'].includes(value) || 'Status must be active, inactive, or pending'
  }
};

// Student validation rules
export const studentValidationRules: ValidationRule[] = [
  { field: 'ten_hoc_sinh', required: true, type: 'string', minLength: 1, maxLength: 255 },
  { field: 'ten_ngan', type: 'string', maxLength: 100 },
  { field: 'ngay_sinh', type: 'date' },
  { field: 'gioi_tinh', type: 'string', custom: (value) => !value || ['nam', 'nu', 'khac'].includes(value) || 'Gender must be nam, nu, or khac' },
  { field: 'so_dien_thoai', type: 'string', pattern: /^[\+]?[1-9][\d]{0,15}$/ },
  { field: 'email', type: 'email' },
  { field: 'dia_chi', type: 'string', maxLength: 500 },
  { field: 'trang_thai', type: 'string', custom: (value) => !value || ['dang_hoc', 'nghi_hoc', 'tot_nghiep'].includes(value) || 'Invalid status' }
];

// Employee validation rules
export const employeeValidationRules: ValidationRule[] = [
  { field: 'ten_nhan_vien', required: true, type: 'string', minLength: 1, maxLength: 255 },
  { field: 'ten_ngan', type: 'string', maxLength: 100 },
  { field: 'bo_phan', type: 'string', maxLength: 100 },
  { field: 'chuc_vu', type: 'string', maxLength: 100 },
  { field: 'so_dien_thoai', type: 'string', pattern: /^[\+]?[1-9][\d]{0,15}$/ },
  { field: 'email', type: 'email' },
  { field: 'ngay_sinh', type: 'date' },
  { field: 'dia_chi', type: 'string', maxLength: 500 },
  { field: 'gioi_tinh', type: 'string', custom: (value) => !value || ['nam', 'nu', 'khac'].includes(value) || 'Gender must be nam, nu, or khac' },
  { field: 'trang_thai', type: 'string', custom: (value) => !value || ['dang_lam', 'nghi_viec', 'tam_nghi'].includes(value) || 'Invalid status' }
];

// Class validation rules
export const classValidationRules: ValidationRule[] = [
  { field: 'ten_lop', required: true, type: 'string', minLength: 1, maxLength: 255 },
  { field: 'mo_ta', type: 'string', maxLength: 1000 },
  { field: 'ngay_bat_dau', type: 'date' },
  { field: 'ngay_ket_thuc', type: 'date' },
  { field: 'trang_thai', type: 'string', custom: (value) => !value || ['dang_mo', 'da_dong', 'tam_dung'].includes(value) || 'Invalid status' },
  { field: 'so_hoc_sinh_toi_da', type: 'number', min: 1, max: 100 }
];

// Teaching session validation rules
export const teachingSessionValidationRules: ValidationRule[] = [
  { field: 'lop_id', required: true, type: 'string', minLength: 1 },
  { field: 'giao_vien_id', required: true, type: 'string', minLength: 1 },
  { field: 'ngay_day', required: true, type: 'date' },
  { field: 'gio_bat_dau', required: true, type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  { field: 'gio_ket_thuc', required: true, type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  { field: 'chu_de', type: 'string', maxLength: 255 },
  { field: 'noi_dung', type: 'string', maxLength: 2000 },
  { field: 'ghi_chu', type: 'string', maxLength: 1000 }
];

// Facility validation rules
export const facilityValidationRules: ValidationRule[] = [
  { field: 'ten_co_so', required: true, type: 'string', minLength: 1, maxLength: 255 },
  { field: 'dia_chi', type: 'string', maxLength: 500 },
  { field: 'so_dien_thoai', type: 'string', pattern: /^[\+]?[1-9][\d]{0,15}$/ },
  { field: 'email', type: 'email' },
  { field: 'trang_thai', type: 'string', custom: (value) => !value || ['hoat_dong', 'tam_dong', 'dong_cua'].includes(value) || 'Invalid status' }
];

// Asset validation rules
export const assetValidationRules: ValidationRule[] = [
  { field: 'ten_tai_san', required: true, type: 'string', minLength: 1, maxLength: 255 },
  { field: 'loai_tai_san', type: 'string', maxLength: 100 },
  { field: 'gia_tri', type: 'number', min: 0 },
  { field: 'ngay_mua', type: 'date' },
  { field: 'trang_thai', type: 'string', custom: (value) => !value || ['tot', 'can_sua', 'hong'].includes(value) || 'Invalid status' },
  { field: 'mo_ta', type: 'string', maxLength: 1000 }
];

// Export validator instance for direct use
export { validator };
