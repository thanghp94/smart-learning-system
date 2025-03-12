
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
    if (!transactionCategory) return;
    
    const fetchTransactionTypes = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('finance_transaction_types')
          .select('id, name')
          .eq('category', transactionCategory);
        
        if (error) throw error;
        
        setTransactionTypes(data || []);
      } catch (error) {
        console.error('Error fetching transaction types:', error);
        setTransactionTypes([]); // Set empty array on error to prevent UI issues
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactionTypes();
  }, [transactionCategory]);

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
                <SelectItem value="" disabled>
                  {isLoading ? 'Đang tải...' : 'Không có loại giao dịch'}
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
