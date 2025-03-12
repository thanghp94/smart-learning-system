
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FinanceNoteFieldProps {
  form: any;
}

const FinanceNoteField: React.FC<FinanceNoteFieldProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="dien_giai"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diễn giải</FormLabel>
            <FormControl>
              <Input placeholder="Nhập diễn giải" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ghi_chu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ghi chú</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Nhập ghi chú"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FinanceNoteField;
