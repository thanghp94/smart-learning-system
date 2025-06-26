
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/DatePicker';

interface FinanceFormHeaderProps {
  form: any;
}

const FinanceFormHeader: React.FC<FinanceFormHeaderProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="ngay"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Ngày</FormLabel>
            <DatePicker
              date={field.value}
              setDate={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="loai_thu_chi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại thu/chi</FormLabel>
            <Select
              onValueChange={(value) => {
                console.log("Selected loai_thu_chi:", value);
                field.onChange(value);
                // Reset transaction type when category changes
                form.setValue('loai_giao_dich', '');
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="thu">Thu</SelectItem>
                <SelectItem value="chi">Chi</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FinanceFormHeader;
