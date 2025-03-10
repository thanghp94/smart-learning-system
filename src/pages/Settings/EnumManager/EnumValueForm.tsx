
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

interface EnumValueFormProps {
  initialData?: Partial<EnumValue>;
  categories: string[];
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isEditMode: boolean;
}

const formSchema = z.object({
  category: z.string().min(1, {
    message: 'Danh mục không được để trống',
  }),
  value: z.string().min(1, {
    message: 'Giá trị không được để trống',
  }),
  description: z.string().optional(),
  order_num: z.coerce.number().int().min(0).optional(),
});

export const EnumValueForm: React.FC<EnumValueFormProps> = ({
  initialData,
  categories,
  onSubmit,
  isEditMode,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: initialData?.category || '',
      value: initialData?.value || '',
      description: initialData?.description || '',
      order_num: initialData?.order_num || 0,
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
                  <div className="flex space-x-2">
                    <Input {...field} placeholder="Nhập tên danh mục" list="categories" />
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
                <Input {...field} placeholder="Nhập giá trị enum" />
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
                <Textarea {...field} placeholder="Mô tả về giá trị enum" />
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
              <FormLabel>Thứ tự hiển thị</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" placeholder="Thứ tự hiển thị" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isEditMode ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </form>
    </Form>
  );
};
