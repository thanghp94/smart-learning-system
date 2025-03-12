
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { recruitmentPositionService, RecruitmentPosition } from '@/lib/supabase/recruitment-service';
import { facilityService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface PositionFormProps {
  positionId?: string;
  onSubmit: () => void;
  onCancel: () => void;
}

const positionSchema = z.object({
  title: z.string().min(2, 'Tiêu đề không được để trống'),
  description: z.string().min(2, 'Mô tả không được để trống'),
  requirements: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  facility_id: z.string().optional().or(z.literal('')),
  department: z.string().optional().or(z.literal('')),
});

type PositionFormData = z.infer<typeof positionSchema>;

const PositionForm: React.FC<PositionFormProps> = ({
  positionId,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facilities, setFacilities] = useState<{id: string; ten_co_so: string}[]>([]);
  const { toast } = useToast();
  const form = useForm<PositionFormData>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      is_active: true,
      facility_id: '',
      department: '',
    },
  });

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await facilityService.getAll();
        setFacilities(data.map(f => ({ id: f.id, ten_co_so: f.ten_co_so })));
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };

    fetchFacilities();

    if (positionId) {
      fetchPosition(positionId);
    }
  }, [positionId]);

  const fetchPosition = async (id: string) => {
    try {
      const position = await recruitmentPositionService.getById(id);
      form.reset(position);
    } catch (error) {
      console.error('Error fetching position:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin vị trí',
        variant: 'destructive',
      });
    }
  };

  const handleFormSubmit = async (data: PositionFormData) => {
    setIsSubmitting(true);
    
    try {
      if (positionId) {
        // Update existing position
        await recruitmentPositionService.update(positionId, data);
      } else {
        // Create new position
        await recruitmentPositionService.create(data);
      }
      
      toast({
        title: 'Thành công',
        description: positionId ? 'Đã cập nhật vị trí' : 'Đã thêm vị trí mới',
      });
      
      onSubmit();
    } catch (error) {
      console.error('Error submitting position:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu thông tin vị trí',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng ban</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="facility_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cơ sở</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cơ sở" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Không có</SelectItem>
                    {facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.ten_co_so}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả công việc</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yêu cầu</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Trạng thái</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : (positionId ? 'Cập nhật' : 'Thêm mới')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PositionForm;
