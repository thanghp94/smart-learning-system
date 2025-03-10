
import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { financeService } from '@/lib/supabase';
import { FinanceTransactionType } from '@/lib/types/finance';
import { UseFormReturn } from 'react-hook-form';

interface TransactionTypeSelectProps {
  form: UseFormReturn<any>;
  selectedTransactionCategory: string;
  selectedEntityType: string | null;
  onTransactionCategoryChange: (value: string) => void;
}

const TransactionTypeSelect: React.FC<TransactionTypeSelectProps> = ({
  form,
  selectedTransactionCategory,
  selectedEntityType,
  onTransactionCategoryChange,
}) => {
  const [transactionTypes, setTransactionTypes] = useState<FinanceTransactionType[]>([]);
  const [filteredTransactionTypes, setFilteredTransactionTypes] = useState<FinanceTransactionType[]>([]);

  // Load all transaction types on component mount
  useEffect(() => {
    const loadAllTransactionTypes = async () => {
      try {
        const types = await financeService.getTransactionTypes();
        setTransactionTypes(types);
        
        // Also filter for the currently selected category
        const filtered = types.filter(type => type.category === selectedTransactionCategory);
        setFilteredTransactionTypes(filtered);
      } catch (error) {
        console.error('Error loading transaction types:', error);
      }
    };
    
    loadAllTransactionTypes();
  }, []);

  // Update transaction types when transaction category changes
  useEffect(() => {
    // Filter transaction types by category
    const filtered = transactionTypes.filter(type => type.category === selectedTransactionCategory);
    
    // Further filter by entity type if needed
    if (selectedEntityType) {
      let typeSpecificItems: FinanceTransactionType[] = [];
      
      // Filter transaction types specific to the selected entity type
      switch (selectedEntityType) {
        case 'student':
          typeSpecificItems = filtered.filter(type => 
            ['Học phí', 'Sách học', 'Hoàn học phí', 'Khen thưởng'].includes(type.name)
          );
          break;
        case 'facility':
          typeSpecificItems = filtered.filter(type => 
            ['Tiền điện', 'Tiền nước', 'Tiền Internet', 'Phí điện thoại cố định', 
             'Tiền rác', 'Tiền thuê nhà', 'Văn phòng phẩm', 'Mua máy móc thiết bị', 
             'Sửa chữa cơ sở vật chất', 'Làm mới cơ sở vật chất', 'Nạp mực in', 
             'Mua dụng cụ vệ sinh nhà cửa'].includes(type.name)
          );
          break;
        case 'employee':
          typeSpecificItems = filtered.filter(type => 
            ['Lương', 'Thưởng', 'Phụ cấp đi lại', 'Lương bảo hiểm', 'Tạm ứng', 
             'Phụ cấp điện thoại', 'Bảo hiểm xã hội', 'Bảo hiểm y tế', 
             'Thưởng Lễ Tết', 'Phụ cấp ăn ở'].includes(type.name)
          );
          break;
        case 'government':
          typeSpecificItems = filtered.filter(type => 
            ['Phí giấy phép lao động', 'Phí thẻ tạm trú'].includes(type.name)
          );
          break;
        case 'event':
          typeSpecificItems = filtered.filter(type => 
            ['Phí thuê địa điểm', 'Phí thuê xe', 'Tiền ăn', 
             'Tiền lương nhân sự', 'Phí sự kiện'].includes(type.name)
          );
          break;
        case 'asset':
          typeSpecificItems = filtered.filter(type => 
            ['Văn phòng phẩm', 'Mua máy móc thiết bị', 'Sửa chữa cơ sở vật chất', 
             'Làm mới cơ sở vật chất', 'Nạp mực in', 'Mua dụng cụ vệ sinh nhà cửa',
             'Phí cơ sở vật chất'].includes(type.name)
          );
          break;
        default:
          typeSpecificItems = filtered;
          break;
      }
      
      // If we have entity-specific items, use those; otherwise fallback to all items in the category
      setFilteredTransactionTypes(typeSpecificItems.length > 0 ? typeSpecificItems : filtered);
    } else {
      setFilteredTransactionTypes(filtered);
    }
    
    // Reset the transaction type if it's no longer valid for the new category or entity type
    const currentType = form.getValues('loai_giao_dich');
    if (currentType && !filtered.some(type => type.name === currentType)) {
      form.setValue('loai_giao_dich', '');
    }
  }, [selectedTransactionCategory, selectedEntityType, transactionTypes, form]);

  return (
    <>
      <FormField
        control={form.control}
        name="loai_thu_chi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại giao dịch <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={(value) => onTransactionCategoryChange(value)} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="income">Thu</SelectItem>
                <SelectItem value="expense">Chi</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="loai_giao_dich"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hạng mục</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hạng mục" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredTransactionTypes.map((type) => (
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
    </>
  );
};

export default TransactionTypeSelect;
