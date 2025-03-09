
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Class, 
  Employee, 
  TeachingSession,
  Session
} from '@/lib/types';
import { classService, employeeService } from '@/lib/supabase';
import { sessionService } from '@/lib/supabase/session-service';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface EvaluationFormProps {
  initialData: TeachingSession;
  onSubmit: (data: Partial<TeachingSession>) => void;
  onCancel?: () => void;
  classInfo?: Class;
  teacherInfo?: Employee;
}

const EvaluationForm = ({ initialData, onSubmit, onCancel, classInfo, teacherInfo }: EvaluationFormProps) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Employee[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | undefined>(classInfo);
  const [selectedTeacher, setSelectedTeacher] = useState<Employee | undefined>(teacherInfo);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TeachingSession>({
    defaultValues: {
      id: initialData.id || '',
      lop_chi_tiet_id: initialData.lop_chi_tiet_id || '',
      session_id: initialData.session_id || '',
      loai_bai_hoc: initialData.loai_bai_hoc || '',
      ngay_hoc: initialData.ngay_hoc || new Date().toISOString().split('T')[0],
      thoi_gian_bat_dau: initialData.thoi_gian_bat_dau || '09:00',
      thoi_gian_ket_thuc: initialData.thoi_gian_ket_thuc || '10:30',
      giao_vien: initialData.giao_vien || '',
      nhan_xet_1: initialData.nhan_xet_1 || '',
      nhan_xet_2: initialData.nhan_xet_2 || '',
      nhan_xet_3: initialData.nhan_xet_3 || '',
      nhan_xet_4: initialData.nhan_xet_4 || '',
      nhan_xet_5: initialData.nhan_xet_5 || '',
      nhan_xet_6: initialData.nhan_xet_6 || '',
      nhan_xet_chung: initialData.nhan_xet_chung || '',
    }
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!initialData.id) {
          // Only load classes and teachers for new evaluations
          const [classesData, teachersData, sessionsData] = await Promise.all([
            classService.getAll(),
            employeeService.getByRole("Giáo viên"),
            sessionService.getAll()
          ]);
          setClasses(classesData || []);
          setTeachers(teachersData || []);
          setSessions(sessionsData || []);
        }
      } catch (error) {
        console.error("Error loading form data:", error);
        setError("Lỗi khi tải dữ liệu: " + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [initialData.id]);

  const handleClassChange = (classId: string) => {
    setValue('lop_chi_tiet_id', classId);
    const selectedClass = classes.find(c => c.id === classId);
    setSelectedClass(selectedClass);
  };

  const handleTeacherChange = (teacherId: string) => {
    setValue('giao_vien', teacherId);
    const selectedTeacher = teachers.find(t => t.id === teacherId);
    setSelectedTeacher(selectedTeacher);
  };
  
  const handleSessionChange = (sessionId: string) => {
    setValue('session_id', sessionId);
  };

  const handleFormSubmit = (data: TeachingSession) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <ExclamationTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {initialData.id && classInfo && teacherInfo && (
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md mb-4">
          <div>
            <p className="text-sm font-medium">Lớp: <span className="font-normal">{classInfo.Ten_lop_full || classInfo.ten_lop_full}</span></p>
            <p className="text-sm font-medium">Buổi học số: <span className="font-normal">{initialData.session_id}</span></p>
            <p className="text-sm font-medium">Ngày học: <span className="font-normal">{initialData.ngay_hoc}</span></p>
          </div>
          <div>
            <p className="text-sm font-medium">Giáo viên: <span className="font-normal">{teacherInfo.ten_nhan_su}</span></p>
            <p className="text-sm font-medium">Loại bài học: <span className="font-normal">{initialData.loai_bai_hoc || 'N/A'}</span></p>
          </div>
        </div>
      )}

      {!initialData.id && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lop_chi_tiet_id">Lớp*</Label>
              <Select
                value={watch('lop_chi_tiet_id')}
                onValueChange={handleClassChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp học" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.ten_lop_full || cls.Ten_lop_full}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.lop_chi_tiet_id && <p className="text-red-500 text-xs mt-1">Vui lòng chọn lớp</p>}
            </div>
            
            <div>
              <Label htmlFor="giao_vien">Giáo viên*</Label>
              <Select
                value={watch('giao_vien')}
                onValueChange={handleTeacherChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giáo viên" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.ten_nhan_su}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.giao_vien && <p className="text-red-500 text-xs mt-1">Vui lòng chọn giáo viên</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="session_id">Buổi học*</Label>
              <Select
                value={watch('session_id')}
                onValueChange={handleSessionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn buổi học" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map(session => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.buoi_hoc_so} - {session.noi_dung_bai_hoc?.substring(0, 30)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.session_id && <p className="text-red-500 text-xs mt-1">Vui lòng chọn buổi học</p>}
            </div>
            
            <div>
              <Label htmlFor="loai_bai_hoc">Loại bài học</Label>
              <Input
                id="loai_bai_hoc"
                {...register('loai_bai_hoc')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ngay_hoc">Ngày học*</Label>
              <Input
                id="ngay_hoc"
                type="date"
                {...register('ngay_hoc', { required: true })}
                className={errors.ngay_hoc ? 'border-red-500' : ''}
              />
              {errors.ngay_hoc && <p className="text-red-500 text-xs mt-1">Vui lòng chọn ngày học</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="thoi_gian_bat_dau">Thời gian bắt đầu*</Label>
                <Input
                  id="thoi_gian_bat_dau"
                  type="time"
                  {...register('thoi_gian_bat_dau', { required: true })}
                  className={errors.thoi_gian_bat_dau ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <Label htmlFor="thoi_gian_ket_thuc">Thời gian kết thúc*</Label>
                <Input
                  id="thoi_gian_ket_thuc"
                  type="time"
                  {...register('thoi_gian_ket_thuc', { required: true })}
                  className={errors.thoi_gian_ket_thuc ? 'border-red-500' : ''}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div>
        <Label htmlFor="nhan_xet_chung">Nhận xét chung</Label>
        <Textarea id="nhan_xet_chung" {...register('nhan_xet_chung')} rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tiêu chí 1: Nội dung bài giảng</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_1', value)}
            defaultValue={watch('nhan_xet_1')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tiêu chí 2: Phương pháp giảng dạy</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_2', value)}
            defaultValue={watch('nhan_xet_2')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tiêu chí 3: Quản lý lớp học</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_3', value)}
            defaultValue={watch('nhan_xet_3')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tiêu chí 4: Tương tác với học sinh</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_4', value)}
            defaultValue={watch('nhan_xet_4')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tiêu chí 5: Sử dụng tài liệu/công cụ</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_5', value)}
            defaultValue={watch('nhan_xet_5')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tiêu chí 6: Đánh giá và phản hồi</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_6', value)}
            defaultValue={watch('nhan_xet_6')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        )}
        <Button type="submit">Lưu đánh giá</Button>
      </div>
    </form>
  );
};

export default EvaluationForm;
