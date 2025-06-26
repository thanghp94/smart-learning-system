
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EnumValue } from '@/lib/supabase/enum-service';

const formSchema = z.object({
  category: z.string().min(1, {
    message: 'Danh mục không được để trống',
  }),
  value: z.string().min(1, {
    message: 'Giá trị không được để trống',
  }),
  description: z.string().optional(),
  order_num: z.coerce.number().int().optional(),
});

interface EnumValueFormProps {
  initialData?: EnumValue;
  categories: string[];
  isEditMode: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export const EnumValueForm: React.FC<EnumValueFormProps> = ({
  initialData,
  categories,
  isEditMode,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: initialData?.category || '',
      value: initialData?.value || '',
      description: initialData?.description || '',
      order_num: initialData?.order_num || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <FormControl>
                {isEditMode ? (
                  <Input {...field} disabled />
                ) : (
                  <div className="flex gap-2">
                    <Input
                      list="categories"
                      {...field}
                      placeholder="Chọn hoặc nhập danh mục mới"
                    />
                    <datalist id="categories">
                      {categories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá trị</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập giá trị" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Nhập mô tả (tùy chọn)"
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order_num"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thứ tự</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value || ''}
                  placeholder="Nhập thứ tự (tùy chọn)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            {isEditMode ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
