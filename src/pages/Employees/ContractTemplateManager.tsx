import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Employee } from '@/lib/types';
import { employeeService } from '@/lib/supabase';

// Helper function to format date
const formatDate = (dateValue: string | Date | undefined) => {
  if (!dateValue) return '';
  try {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return format(date, 'dd/MM/yyyy', { locale: vi });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateValue);
  }
};

// Helper function to format currency
const formatCurrency = (amount: number | string | undefined) => {
  if (!amount) return '';
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
  } catch (error) {
    console.error('Error formatting currency:', error);
    return String(amount);
  }
};

// Rest of your ContractTemplateManager component implementation

// ... keep existing code (component implementation) the same ...

// For the merge fields processing logic, update the code to use the formatDate and formatCurrency helpers
const processMergeFields = (template: string, employee: Employee) => {
  if (!template || !employee) return '';
  
  let processed = template;
  
  // Basic employee information
  processed = processed.replace(/{{ten_nhan_su}}/g, employee.ten_nhan_su || '');
  processed = processed.replace(/{{email}}/g, employee.email || '');
  processed = processed.replace(/{{dien_thoai}}/g, employee.dien_thoai || '');
  processed = processed.replace(/{{dia_chi}}/g, employee.dia_chi || '');
  processed = processed.replace(/{{bo_phan}}/g, employee.bo_phan || '');
  processed = processed.replace(/{{chuc_danh}}/g, employee.chuc_danh || '');
  
  // Date fields with formatting
  processed = processed.replace(/{{ngay_sinh}}/g, formatDate(employee.ngay_sinh));
  processed = processed.replace(/{{ngay_vao_lam}}/g, formatDate(employee.ngay_vao_lam));
  
  // Currency fields with formatting
  processed = processed.replace(/{{luong_co_ban}}/g, formatCurrency(employee.luong_co_ban));
  
  return processed;
};

// ... keep rest of the existing code the same ...

export default ContractTemplateManager;
