
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { employeeClockInService } from '@/lib/supabase';

interface ClockInFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const ClockInForm: React.FC<ClockInFormProps> = ({ onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await employeeClockInService.clockIn({
        ngay: format(new Date(), 'yyyy-MM-dd'),
        thoi_gian_bat_dau: format(new Date(), 'HH:mm:ss'),
        trang_thai: 'present',
      });

      toast({
        title: 'Thành công',
        description: 'Đã chấm công thành công',
      });
      onSubmit();
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chấm công',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p>Bạn có muốn chấm công cho hôm nay ({format(new Date(), 'dd/MM/yyyy')}) không?</p>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang chấm công...' : 'Chấm công'}
        </Button>
      </div>
    </form>
  );
};

const TodayAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showClockInForm, setShowClockInForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        setIsLoading(true);
        const today = format(new Date(), 'yyyy-MM-dd');
        const data = await employeeClockInService.getByDate(today);
        setAttendance(data.length > 0 ? data[0] : null);
      } catch (error) {
        console.error('Error fetching today attendance:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin chấm công',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayAttendance();
  }, [toast]);

  const handleClockInSubmit = () => {
    setShowClockInForm(false);
    fetchTodayAttendance();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Có mặt</Badge>;
      case 'absent':
        return <Badge variant="destructive">Vắng mặt</Badge>;
      case 'late':
        return <Badge variant="warning">Đi muộn</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Chấm công hôm nay
        </CardTitle>
        {!attendance && !isLoading && (
          <Button size="sm" onClick={() => setShowClockInForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Chấm công
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : attendance ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ngày</p>
                <p>{format(new Date(attendance.ngay), 'dd/MM/yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <p>{getStatusBadge(attendance.trang_thai)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Giờ vào</p>
                <p>
                  {attendance.thoi_gian_bat_dau
                    ? format(
                        new Date(`2000-01-01T${attendance.thoi_gian_bat_dau}`),
                        'HH:mm'
                      )
                    : '--'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giờ ra</p>
                <p>
                  {attendance.thoi_gian_ket_thuc
                    ? format(
                        new Date(`2000-01-01T${attendance.thoi_gian_ket_thuc}`),
                        'HH:mm'
                      )
                    : '--'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            Bạn chưa chấm công hôm nay
          </p>
        )}
      </CardContent>

      <Dialog open={showClockInForm} onOpenChange={setShowClockInForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chấm công</DialogTitle>
          </DialogHeader>
          <ClockInForm
            onSubmit={handleClockInSubmit}
            onCancel={() => setShowClockInForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TodayAttendance;
