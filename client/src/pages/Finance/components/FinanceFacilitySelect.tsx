
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Facility } from '@/lib/types';

interface FinanceFacilitySelectProps {
  form: any;
  facilities: Facility[];
}

const FinanceFacilitySelect: React.FC<FinanceFacilitySelectProps> = ({ form, facilities }) => {
  return (
    <FormField
      control={form.control}
      name="co_so"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cơ sở</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || ''}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn cơ sở" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {facilities.map((facility) => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.ten_co_so}
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

export default FinanceFacilitySelect;
