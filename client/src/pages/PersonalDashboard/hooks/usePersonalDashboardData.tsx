
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { taskService } from "@/lib/database";
import { Task, Request } from '@/lib/types';

export function usePersonalDashboardData() {
  const [employee, setEmployee] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPersonalData = async () => {
    try {
      setIsLoading(true);
      // For now, mock data - in a real app this would come from auth context or API
      const userData = {
        id: '123',
        ten_nhan_su: 'Nguyễn Văn A',
        chuc_danh: 'Giáo viên',
        bo_phan: 'Đào tạo',
        ngay_sinh: '1990-01-01',
        dien_thoai: '0923456789',
        email: 'nguyen.van.a@example.com'
      };
      setEmployee(userData);

      // Fetch tasks
      try {
        console.log('Fetching tasks...');
        const tasksData = await taskService.getTasks();
        console.log('Tasks fetched:', tasksData);
        setTasks(tasksData.slice(0, 5)); // Just get the first 5 tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      }

      // Mock requests data
      setRequests([
        {
          id: '1',
          type: 'facility',
          title: 'Sửa máy chiếu Phòng A1',
          description: 'Máy chiếu không hoạt động bình thường',
          requester: 'Nguyễn Văn A',
          requested_date: new Date().toISOString(),
          status: 'pending',
          priority: 'medium',
          entity_type: 'facility',
          entity_id: 'a1',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'leave',
          title: 'Đơn xin nghỉ phép',
          description: 'Xin nghỉ phép 3 ngày từ 20/03/2025',
          requester: 'Nguyễn Văn A',
          requested_date: new Date().toISOString(),
          status: 'approved',
          priority: 'high',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        }
      ]);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching personal data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu cá nhân',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalData();
  }, []);

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
    toast({
      title: 'Thành công',
      description: 'Đã tạo công việc mới',
    });
  };

  const handleRequestCreated = (newRequest: Request) => {
    setRequests([newRequest, ...requests]);
    toast({
      title: 'Thành công',
      description: 'Đã tạo đề xuất mới',
    });
  };

  return {
    employee,
    tasks,
    requests,
    isLoading,
    fetchPersonalData,
    handleTaskCreated,
    handleRequestCreated
  };
}
