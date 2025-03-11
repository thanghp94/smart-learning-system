
import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';

interface PaymentMethodSelectorProps {
  form: any;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="kieu_thanh_toan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kiểu thanh toán</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kiểu thanh toán" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="cash">Tiền mặt</SelectItem>
                <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bang_chu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bằng chữ</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Viết bằng chữ"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PaymentMethodSelector;
