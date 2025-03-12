
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

interface TransactionTypeSelectProps {
  form: any;
  transactionCategory: string | undefined;
}

const TransactionTypeSelect: React.FC<TransactionTypeSelectProps> = ({ form, transactionCategory }) => {
  const [transactionTypes, setTransactionTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactionTypes = async () => {
      if (!transactionCategory) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching transaction types for category:', transactionCategory);
        const types = await financeService.getTransactionTypes();
        console.log('Fetched transaction types:', types);
        
        if (Array.isArray(types)) {
          setTransactionTypes(types);
        } else {
          console.error('Expected array of transaction types but got:', types);
          setTransactionTypes([]);
        }
      } catch (error) {
        console.error('Error fetching transaction types:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách loại giao dịch',
          variant: 'destructive',
        });
        setTransactionTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionTypes();
  }, [transactionCategory, toast]);

  // Map category "thu" to "income" and "chi" to "expense"
  const mappedCategory = transactionCategory === 'thu' ? 'income' : transactionCategory === 'chi' ? 'expense' : transactionCategory;

  // Filter types by the selected category (thu/chi)
  const filteredTypes = transactionTypes.filter(type => 
    type.category === mappedCategory
  );

  console.log('Filtered types:', filteredTypes, 'for category:', mappedCategory);

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
              {filteredTypes.length > 0 ? (
                filteredTypes.map(type => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
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
