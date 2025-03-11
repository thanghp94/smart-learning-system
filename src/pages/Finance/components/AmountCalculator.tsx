
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface AmountCalculatorProps {
  form: any;
}

const AmountCalculator: React.FC<AmountCalculatorProps> = ({ form }) => {
  const watchAmount = form.watch('so_luong') || 0;
  const watchUnit = form.watch('don_vi') || 0;
  const watchPrice = form.watch('gia_tien') || 0;
  const total = watchAmount * watchUnit * watchPrice;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="so_luong"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập số lượng"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="don_vi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đơn vị</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập đơn vị"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gia_tien"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá tiền</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập giá tiền"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="tong_tien"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tổng tiền</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Tổng tiền"
                {...field}
                value={total || field.value}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ten_phi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên phí</FormLabel>
            <FormControl>
              <Input placeholder="Nhập tên phí" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AmountCalculator;
