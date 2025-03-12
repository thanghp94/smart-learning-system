
import React, { useEffect, useState } from 'react';
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
import { financeService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const TransactionTypeSelect = ({ form, transactionCategory }) => {
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactionTypes = async () => {
      if (!transactionCategory) return;
      
      setIsLoading(true);
      try {
        const types = await financeService.getTransactionTypes();
        setTransactionTypes(types);
      } catch (error) {
        console.error('Error fetching transaction types:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách loại giao dịch',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionTypes();
  }, [transactionCategory, toast]);

  // Filter types by the selected category (thu/chi)
  const filteredTypes = transactionTypes.filter(type => 
    type.category === transactionCategory
  );

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
            disabled={isLoading || !transactionCategory}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? 'Đang tải...' : 'Chọn loại giao dịch'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {filteredTypes.map(type => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
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

export default TransactionTypeSelect;
