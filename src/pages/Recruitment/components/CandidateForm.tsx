
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
import { Candidate, candidateService, CandidateStatus, recruitmentPositionService } from '@/lib/supabase/recruitment-service';
import { useToast } from '@/hooks/use-toast';

interface CandidateFormProps {
  candidateId?: string;
  onSubmit: () => void;
  onCancel: () => void;
}

const candidateSchema = z.object({
  full_name: z.string().min(2, 'Tên không được để trống'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  birth_date: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  cv_path: z.string().optional().or(z.literal('')),
  linkedin_url: z.string().optional().or(z.literal('')),
  portfolio_url: z.string().optional().or(z.literal('')),
  current_status: z.string(),
  current_position: z.string().optional().or(z.literal('')),
  years_of_experience: z.number().optional(),
  education_level: z.string().optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
  notes: z.string().optional().or(z.literal('')),
  position_id: z.string().optional().or(z.literal('')),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

const STATUS_OPTIONS: { label: string; value: CandidateStatus }[] = [
  { label: 'Hồ sơ mới', value: 'new_application' },
  { label: 'Đang xem xét CV', value: 'cv_reviewing' },
  { label: 'Đã lên lịch phỏng vấn', value: 'interview_scheduled' },
  { label: 'Đã qua phỏng vấn', value: 'passed_interview' },
  { label: 'Đã gửi đề nghị', value: 'offer_sent' },
  { label: 'Đã tuyển', value: 'hired' },
  { label: 'Từ chối', value: 'rejected' },
];

const CandidateForm: React.FC<CandidateFormProps> = ({
  candidateId,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [positions, setPositions] = useState<{id: string; title: string}[]>([]);
  const { toast } = useToast();
  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      address: '',
      birth_date: '',
      gender: '',
      cv_path: '',
      linkedin_url: '',
      portfolio_url: '',
      current_status: 'new_application',
      current_position: '',
      years_of_experience: 0,
      education_level: '',
      skills: [],
      notes: '',
      position_id: '',
    },
  });

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await recruitmentPositionService.getAll();
        setPositions(data.map(p => ({ id: p.id, title: p.title })));
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();

    if (candidateId) {
      fetchCandidate(candidateId);
    }
  }, [candidateId]);

  const fetchCandidate = async (id: string) => {
    try {
      const candidate = await candidateService.getById(id);
      
      // Find application for this candidate to get position_id
      const applicationData = await fetchApplication(id);
      const position_id = applicationData?.position_id || '';
      
      form.reset({
        ...candidate,
        position_id,
        years_of_experience: candidate.years_of_experience || 0,
        skills: candidate.skills || [],
      });
    } catch (error) {
      console.error('Error fetching candidate:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin ứng viên',
        variant: 'destructive',
      });
    }
  };

  const fetchApplication = async (candidateId: string) => {
    try {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('candidate_id', candidateId)
        .single();
      
      return data;
    } catch (error) {
      console.error('Error fetching application:', error);
      return null;
    }
  };

  const handleFormSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true);
    
    try {
      const formattedData: Partial<Candidate> = {
        ...data,
        years_of_experience: data.years_of_experience || null,
      };
      
      let candidateResult;
      
      if (candidateId) {
        // Update existing candidate
        candidateResult = await candidateService.update(candidateId, formattedData);
      } else {
        // Create new candidate
        candidateResult = await candidateService.create(formattedData);
      }
      
      // If position is selected, create/update application
      if (data.position_id) {
        await handleApplicationSubmit(candidateResult.id, data.position_id, data.current_status as CandidateStatus);
      }
      
      toast({
        title: 'Thành công',
        description: candidateId ? 'Đã cập nhật ứng viên' : 'Đã thêm ứng viên mới',
      });
      
      onSubmit();
    } catch (error) {
      console.error('Error submitting candidate:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu thông tin ứng viên',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplicationSubmit = async (
    candidateId: string,
    positionId: string,
    status: CandidateStatus
  ) => {
    // Check if application already exists
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();
    
    if (existingApplication) {
      // Update existing application
      await supabase
        .from('applications')
        .update({
          position_id: positionId,
          status
        })
        .eq('id', existingApplication.id);
    } else {
      // Create new application
      await supabase
        .from('applications')
        .insert({
          candidate_id: candidateId,
          position_id: positionId,
          status
        });
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsString = e.target.value;
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
    form.setValue('skills', skillsArray);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
            
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
          
          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin nghề nghiệp</h3>
            
            <FormField
              control={form.control}
              name="current_position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí hiện tại</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Input 
                      {...field} 
                      type="number" 
                      min="0"
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="education_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trình độ học vấn</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kỹ năng (phân cách bằng dấu phẩy)</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value?.join(', ') || ''} 
                      onChange={handleSkillsChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="position_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí ứng tuyển</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Không có</SelectItem>
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
              name="current_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Thông tin bổ sung</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="cv_path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link CV</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Portfolio URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : (candidateId ? 'Cập nhật' : 'Thêm mới')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CandidateForm;
