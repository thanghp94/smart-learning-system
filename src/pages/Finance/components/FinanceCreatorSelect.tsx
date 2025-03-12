
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@/lib/types';

interface FinanceCreatorSelectProps {
  form: any;
  employees: Employee[];
}

const FinanceCreatorSelect: React.FC<FinanceCreatorSelectProps> = ({ form, employees }) => {
  return (
    <FormField
      control={form.control}
      name="nguoi_tao"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Người tạo</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || ''}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn người tạo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.ten_nhan_su}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FinanceCreatorSelect;
