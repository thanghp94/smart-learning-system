
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionTypeSelectProps {
  form: any;
  transactionCategory: string;
}

const TransactionTypeSelect = ({ form, transactionCategory }: TransactionTypeSelectProps) => {
  const handleTypeChange = (value: string) => {
    // Prevent default link behavior
    form.setValue('loai_giao_dich', value);
  };

  return (
    <FormField
      control={form.control}
      name="loai_giao_dich"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Loại giao dịch</FormLabel>
          <Select
            onValueChange={handleTypeChange}
            value={field.value || ''}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại giao dịch" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {transactionCategory === 'thu' ? (
                <>
                  <SelectItem value="hoc_phi">Học phí</SelectItem>
                  <SelectItem value="phu_phi">Phụ phí</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="luong">Lương</SelectItem>
                  <SelectItem value="thue_mb">Thuê mặt bằng</SelectItem>
                  <SelectItem value="csvc">Cơ sở vật chất</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TransactionTypeSelect;
