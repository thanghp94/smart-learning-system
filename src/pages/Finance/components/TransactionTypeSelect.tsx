
import React, { useEffect } from 'react';
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
  onTransactionTypeChange?: (type: string, typeLabel: string) => void;
}

const TransactionTypeSelect = ({ 
  form, 
  transactionCategory, 
  onTransactionTypeChange 
}: TransactionTypeSelectProps) => {
  const handleTypeChange = (value: string) => {
    // Prevent default link behavior
    form.setValue('loai_giao_dich', value);
    
    // Get the label for the selected transaction type
    let typeLabel = '';
    if (value === 'hoc_phi') typeLabel = 'Học phí';
    else if (value === 'phu_phi') typeLabel = 'Phụ phí';
    else if (value === 'luong') typeLabel = 'Lương';
    else if (value === 'thue_mb') typeLabel = 'Thuê mặt bằng';
    else if (value === 'csvc') typeLabel = 'Cơ sở vật chất';
    else typeLabel = 'Khác';
    
    // Call callback to update description
    if (onTransactionTypeChange) {
      onTransactionTypeChange(value, typeLabel);
    }
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
