
import React, { useState, useEffect } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase/client';

interface TransactionTypeSelectProps {
  form: any;
  transactionCategory: string;
}

const TransactionTypeSelect: React.FC<TransactionTypeSelectProps> = ({ form, transactionCategory }) => {
  const [transactionTypes, setTransactionTypes] = useState<Array<{id: string; name: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!transactionCategory) {
      setTransactionTypes([]);
      // Reset form field if category is empty
      form.setValue('loai_giao_dich', '');
      return;
    }
    
    const fetchTransactionTypes = async () => {
      setIsLoading(true);
      try {
        // Get the category value to search for (converting from UI terms to database terms)
        let categoryValue = '';
        if (transactionCategory === 'thu') {
          categoryValue = 'income';
        } else if (transactionCategory === 'chi') {
          categoryValue = 'expense';
        } else {
          categoryValue = transactionCategory;
        }
        
        const { data, error } = await supabase
          .from('finance_transaction_types')
          .select('id, name')
          .eq('category', categoryValue);
        
        if (error) throw error;
        
        setTransactionTypes(data || []);
        
        // If the currently selected value is not in the new options list, reset it
        const currentValue = form.getValues('loai_giao_dich');
        if (currentValue && data && !data.some(item => item.id === currentValue)) {
          form.setValue('loai_giao_dich', '');
        }
      } catch (error) {
        console.error('Error fetching transaction types:', error);
        setTransactionTypes([]); // Set empty array on error to prevent UI issues
        form.setValue('loai_giao_dich', ''); // Reset value on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactionTypes();
  }, [transactionCategory, form]);

  return (
    <FormField
      control={form.control}
      name="loai_giao_dich"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Loại giao dịch</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || ''}
            disabled={isLoading || transactionTypes.length === 0}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoading ? 'Đang tải...' : 
                  !transactionCategory ? 'Vui lòng chọn danh mục trước' :
                  transactionTypes.length === 0 ? 'Không có loại giao dịch' : 
                  'Chọn loại giao dịch'
                } />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {transactionTypes.length > 0 ? (
                transactionTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-value" disabled>
                  {isLoading ? 'Đang tải...' : 
                   !transactionCategory ? 'Vui lòng chọn danh mục trước' : 
                   'Không có loại giao dịch'}
                </SelectItem>
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
