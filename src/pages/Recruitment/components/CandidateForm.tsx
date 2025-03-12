
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import ImageUpload from '@/components/common/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import { positionService } from '@/lib/supabase/position-service';
import { candidateService } from '@/lib/supabase/candidate-service';
import { Candidate, CandidateStatus, Position } from '@/lib/types';
import { Label } from '@/components/ui/label';

const candidateSchema = z.object({
  full_name: z.string().min(1, { message: 'Họ tên không được để trống' }),
  email: z.string().email({ message: 'Email không hợp lệ' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  birth_date: z.date().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  years_of_experience: z.coerce.number().min(0).default(0),
  education: z.string().optional(),
  skills: z.string().optional(),
  current_status: z.enum(['new', 'screening', 'interview', 'offer', 'hired', 'rejected']).default('new'),
  position_id: z.string().optional(),
  notes: z.string().optional(),
  desired_salary: z.string().optional(),
  cv_path: z.string().optional(),
  linkedin_url: z.string().optional(),
  portfolio_url: z.string().optional(),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

interface CandidateFormProps {
  initialData?: Partial<Candidate>;
  onSubmit: (data: Partial<Candidate>) => void;
  onCancel: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string>(initialData.cv_path || '');
  const [photoUrl, setPhotoUrl] = useState<string>(initialData.photo_url || '');
  const { toast } = useToast();
  
  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      full_name: initialData.full_name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      birth_date: initialData.birth_date ? new Date(initialData.birth_date) : undefined,
      gender: initialData.gender || '',
      address: initialData.address || '',
      years_of_experience: initialData.years_of_experience || 0,
      education: initialData.education || '',
      skills: initialData.skills || '',
      current_status: initialData.current_status || 'new',
      position_id: initialData.position_id || '',
      notes: initialData.notes || '',
      desired_salary: initialData.desired_salary || '',
      cv_path: initialData.cv_path || '',
      linkedin_url: initialData.linkedin_url || '',
      portfolio_url: initialData.portfolio_url || '',
    },
  });

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const positionsData = await positionService.getAll();
        setPositions(positionsData);
      } catch (error) {
        console.error('Error fetching positions:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách vị trí',
          variant: 'destructive',
        });
      }
    };

    fetchPositions();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const uploadCv = async (): Promise<string> => {
    if (!cvFile) return cvUrl;
    
    try {
      // In a real implementation, this would upload to Supabase storage
      // For now, let's simulate a successful upload
      // const { data } = await supabase.storage.from('cvs').upload(`cv-${Date.now()}`, cvFile);
      // return data?.path || '';
      
      // Mock response
      return `/mock-uploads/cv-${Date.now()}-${cvFile.name}`;
    } catch (error) {
      console.error('Error uploading CV:', error);
      throw new Error('Failed to upload CV');
    }
  };

  const handleFormSubmit = async (values: CandidateFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Upload CV if provided
      let cvPath = cvUrl;
      if (cvFile) {
        cvPath = await uploadCv();
      }
      
      // Prepare data for submission
      const candidateData: Partial<Candidate> = {
        ...values,
        cv_path: cvPath,
        photo_url: photoUrl,
        current_status: values.current_status as CandidateStatus,
      };
      
      onSubmit(candidateData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu thông tin ứng viên',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (url: string) => {
    setPhotoUrl(url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày sinh</FormLabel>
                    <DatePicker 
                      date={field.value} 
                      onSelect={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Label>Ảnh chân dung</Label>
            <ImageUpload
              currentUrl={photoUrl}
              onUpload={handlePhotoUpload}
              entityType="candidate"
              entityId={initialData.id || "new"}
              onRemove={() => setPhotoUrl('')}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input placeholder="Địa chỉ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="position_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vị trí ứng tuyển</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vị trí" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="years_of_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số năm kinh nghiệm</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="desired_salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mức lương mong muốn</FormLabel>
                <FormControl>
                  <Input placeholder="Mức lương mong muốn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">Mới</SelectItem>
                    <SelectItem value="screening">Sàng lọc</SelectItem>
                    <SelectItem value="interview">Phỏng vấn</SelectItem>
                    <SelectItem value="offer">Đề xuất</SelectItem>
                    <SelectItem value="hired">Đã thuê</SelectItem>
                    <SelectItem value="rejected">Đã từ chối</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kỹ năng</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Các kỹ năng của ứng viên" 
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Học vấn</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Thông tin học vấn" 
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input placeholder="LinkedIn profile URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portfolio_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website / Portfolio</FormLabel>
                <FormControl>
                  <Input placeholder="Website or portfolio URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Label>CV / Sơ yếu lý lịch</Label>
          <div className="mt-2 flex items-center gap-4">
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="max-w-md"
            />
            {cvUrl && (
              <div className="text-sm text-blue-500 underline">
                <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                  Xem CV hiện tại
                </a>
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ghi chú thêm về ứng viên" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CandidateForm;
