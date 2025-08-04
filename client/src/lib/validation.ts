// Centralized form validation system
import { logError } from './logger';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'date' | 'array' | 'object' | 'phone';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  allowEmpty?: boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
}

export interface ValidationSchema<T = any> {
  [key: string]: ValidationRule | ValidationRule[];
}

class FormValidator {
  private validateFieldInternal(value: any, rules: ValidationRule | ValidationRule[], fieldName: string): string[] {
    const errors: string[] = [];
    const ruleArray = Array.isArray(rules) ? rules : [rules];

    for (const rule of ruleArray) {
      const fieldErrors = this.validateSingleRule(value, rule, fieldName);
      errors.push(...fieldErrors);
    }

    return errors;
  }

  private validateSingleRule(value: any, rule: ValidationRule, fieldName: string): string[] {
    const errors: string[] = [];
    const { required, type, minLength, maxLength, min, max, pattern, custom, allowEmpty, message } = rule;

    // Check if field is required
    if (required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(message || `${fieldName} is required`);
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
            errors.push(message || `${fieldName} must be a string`);
          }
          break;
        case 'number':
          if (typeof value !== 'number' && !Number.isFinite(Number(value))) {
            errors.push(message || `${fieldName} must be a number`);
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(message || `${fieldName} must be a boolean`);
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof value !== 'string' || !emailRegex.test(value)) {
            errors.push(message || `${fieldName} must be a valid email address`);
          }
          break;
        case 'phone':
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (typeof value !== 'string' || !phoneRegex.test(value.replace(/\s/g, ''))) {
            errors.push(message || `${fieldName} must be a valid phone number`);
          }
          break;
        case 'date':
          if (!(value instanceof Date) && isNaN(Date.parse(value))) {
            errors.push(message || `${fieldName} must be a valid date`);
          }
          break;
        case 'array':
          if (!Array.isArray(value)) {
            errors.push(message || `${fieldName} must be an array`);
          }
          break;
        case 'object':
          if (typeof value !== 'object' || Array.isArray(value)) {
            errors.push(message || `${fieldName} must be an object`);
          }
          break;
      }
    }

    // String length validation
    if (typeof value === 'string') {
      if (minLength !== undefined && value.length < minLength) {
        errors.push(message || `${fieldName} must be at least ${minLength} characters long`);
      }
      if (maxLength !== undefined && value.length > maxLength) {
        errors.push(message || `${fieldName} must be no more than ${maxLength} characters long`);
      }
    }

    // Number range validation
    if (typeof value === 'number' || (type === 'number' && Number.isFinite(Number(value)))) {
      const numValue = typeof value === 'number' ? value : Number(value);
      if (min !== undefined && numValue < min) {
        errors.push(message || `${fieldName} must be at least ${min}`);
      }
      if (max !== undefined && numValue > max) {
        errors.push(message || `${fieldName} must be no more than ${max}`);
      }
    }

    // Pattern validation
    if (pattern && typeof value === 'string' && !pattern.test(value)) {
      errors.push(message || `${fieldName} format is invalid`);
    }

    // Custom validation
    if (custom) {
      try {
        const customResult = custom(value);
        if (customResult !== true) {
          errors.push(typeof customResult === 'string' ? customResult : (message || `${fieldName} is invalid`));
        }
      } catch (error) {
        logError('Custom validation error', error, { field: fieldName, value });
        errors.push(message || `${fieldName} validation failed`);
      }
    }

    return errors;
  }

  validate<T>(data: T, schema: ValidationSchema<T>): ValidationResult {
    const errors: Record<string, string> = {};
    let firstError: string | undefined;

    try {
      for (const [fieldName, rules] of Object.entries(schema)) {
        if (rules) {
          const fieldValue = (data as any)[fieldName];
          const fieldErrors = this.validateFieldInternal(fieldValue, rules as ValidationRule | ValidationRule[], fieldName);
          
          if (fieldErrors.length > 0) {
            errors[fieldName] = fieldErrors[0]; // Take the first error for each field
            if (!firstError) {
              firstError = fieldErrors[0];
            }
          }
        }
      }
    } catch (error) {
      logError('Form validation error', error, { data, schema });
      return {
        isValid: false,
        errors: { _general: 'Validation failed due to an internal error' },
        firstError: 'Validation failed due to an internal error'
      };
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      firstError
    };
  }

  // Validate a single field
  validateField<T>(data: T, fieldName: keyof T, rules: ValidationRule | ValidationRule[]): ValidationResult {
    const fieldValue = data[fieldName];
    const fieldErrors = this.validateFieldInternal(fieldValue, rules, String(fieldName));
    
    return {
      isValid: fieldErrors.length === 0,
      errors: fieldErrors.length > 0 ? { [String(fieldName)]: fieldErrors[0] } : {},
      firstError: fieldErrors[0]
    };
  }
}

// Create validator instance
const validator = new FormValidator();

// Factory function to create form validators
export const createFormValidator = <T>(schema: ValidationSchema<T>) => {
  return (data: T): ValidationResult => {
    return validator.validate(data, schema);
  };
};

// Hook for form validation
export const useFormValidation = <T>(schema: ValidationSchema<T>) => {
  const validateForm = (data: T): ValidationResult => {
    return validator.validate(data, schema);
  };

  const validateField = (data: T, fieldName: keyof T, rules: ValidationRule | ValidationRule[]): ValidationResult => {
    return validator.validateField(data, fieldName, rules);
  };

  return {
    validateForm,
    validateField
  };
};

// Common validation rules
export const commonValidationRules = {
  required: { required: true },
  email: { type: 'email' as const, required: true },
  phone: { type: 'phone' as const },
  positiveNumber: { type: 'number' as const, min: 0 },
  nonEmptyString: { type: 'string' as const, required: true, minLength: 1 },
  shortText: { type: 'string' as const, maxLength: 255 },
  longText: { type: 'string' as const, maxLength: 2000 },
  date: { type: 'date' as const },
  requiredDate: { type: 'date' as const, required: true }
};

// Pre-defined validation schemas for common entities
export const studentValidationSchema: ValidationSchema<any> = {
  ten_hoc_sinh: { field: 'ten_hoc_sinh', required: true, type: 'string', minLength: 1, maxLength: 255 },
  ten_ngan: { field: 'ten_ngan', type: 'string', maxLength: 100 },
  ngay_sinh: { field: 'ngay_sinh', type: 'date' },
  gioi_tinh: { 
    field: 'gioi_tinh',
    type: 'string', 
    custom: (value: any) => !value || ['nam', 'nu', 'khac'].includes(value) || 'Gender must be nam, nu, or khac' 
  },
  so_dien_thoai: { field: 'so_dien_thoai', type: 'phone' },
  email: { field: 'email', type: 'email' },
  dia_chi: { field: 'dia_chi', type: 'string', maxLength: 500 },
  trang_thai: { 
    field: 'trang_thai',
    type: 'string', 
    custom: (value: any) => !value || ['dang_hoc', 'nghi_hoc', 'tot_nghiep'].includes(value) || 'Invalid status' 
  }
};

export const employeeValidationSchema: ValidationSchema<any> = {
  ten_nhan_vien: { field: 'ten_nhan_vien', required: true, type: 'string', minLength: 1, maxLength: 255 },
  ten_ngan: { field: 'ten_ngan', type: 'string', maxLength: 100 },
  bo_phan: { field: 'bo_phan', type: 'string', maxLength: 100 },
  chuc_vu: { field: 'chuc_vu', type: 'string', maxLength: 100 },
  so_dien_thoai: { field: 'so_dien_thoai', type: 'phone' },
  email: { field: 'email', type: 'email' },
  ngay_sinh: { field: 'ngay_sinh', type: 'date' },
  dia_chi: { field: 'dia_chi', type: 'string', maxLength: 500 },
  gioi_tinh: { 
    field: 'gioi_tinh',
    type: 'string', 
    custom: (value: any) => !value || ['nam', 'nu', 'khac'].includes(value) || 'Gender must be nam, nu, or khac' 
  },
  trang_thai: { 
    field: 'trang_thai',
    type: 'string', 
    custom: (value: any) => !value || ['dang_lam', 'nghi_viec', 'tam_nghi'].includes(value) || 'Invalid status' 
  }
};

export const classValidationSchema: ValidationSchema<any> = {
  ten_lop: { field: 'ten_lop', required: true, type: 'string', minLength: 1, maxLength: 255 },
  mo_ta: { field: 'mo_ta', type: 'string', maxLength: 1000 },
  ngay_bat_dau: { field: 'ngay_bat_dau', type: 'date' },
  ngay_ket_thuc: { field: 'ngay_ket_thuc', type: 'date' },
  trang_thai: { 
    field: 'trang_thai',
    type: 'string', 
    custom: (value: any) => !value || ['dang_mo', 'da_dong', 'tam_dung'].includes(value) || 'Invalid status' 
  },
  so_hoc_sinh_toi_da: { field: 'so_hoc_sinh_toi_da', type: 'number', min: 1, max: 100 }
};

// Export the validator instance for direct use
export { validator };
export default validator;
