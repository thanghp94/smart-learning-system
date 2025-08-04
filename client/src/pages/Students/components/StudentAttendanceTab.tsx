
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { databaseService } from "@/lib/database";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface StudentAttendanceTabProps {
  studentId: string;
}

const StudentAttendanceTab: React.FC<StudentAttendanceTabProps> = ({ studentId }) => {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendances();
  }, [studentId]);

  const fetchAttendances = async () => {
    if (!studentId) return;

    setIsLoading(true);
    try {
      // Get all attendances for this student using the view
      const { data, error } = await supabase
        .from('attendances_with_details')
        .select('*')
        .eq('hoc_sinh_id', studentId)
        .order('ngay_hoc', { ascending: false });
      
      if (error) throw error;
      setAttendances(data || []);
    } catch (error) {
      console.error('Error fetching attendances:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lịch sử điểm danh',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'EEEE, dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Format HH:MM
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Có mặt</Badge>;
      case 'absent':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Vắng mặt</Badge>;
      case 'late':
        return <Badge variant="warning" className="bg-amber-500"><Clock className="h-3 w-3 mr-1" /> Đi muộn</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" /> Chưa điểm danh</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Lịch sử điểm danh</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Đang tải dữ liệu...</div>
        ) : attendances.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Không có dữ liệu điểm danh nào
          </div>
        ) : (
          <div className="space-y-4">
            {attendances.map((attendance) => (
              <div key={attendance.id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{attendance.ten_lop_full}</h3>
                  {getStatusBadge(attendance.status)}
                </div>
                
                <div className="flex items-center text-sm mb-2">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{formatDate(attendance.ngay_hoc)}</span>
                  {attendance.thoi_gian_bat_dau && (
                    <span className="ml-2">
                      {formatTime(attendance.thoi_gian_bat_dau)} - {formatTime(attendance.thoi_gian_ket_thuc)}
                    </span>
                  )}
                </div>
                
                {attendance.status === 'late' && attendance.thoi_gian_tre > 0 && (
                  <div className="text-sm text-amber-600">
                    Đi muộn {attendance.thoi_gian_tre} phút
                  </div>
                )}
                
                {attendance.ghi_chu && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Ghi chú:</span> {attendance.ghi_chu}
                  </div>
                )}
                
                {/* Display evaluation if any */}
                {(attendance.danh_gia_1 || attendance.danh_gia_2 || attendance.danh_gia_3 || attendance.danh_gia_4) && (
                  <div className="mt-3 text-sm border-t pt-2">
                    <div className="font-medium mb-1">Đánh giá buổi học:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {attendance.danh_gia_1 && (
                        <div>Tham gia: {attendance.danh_gia_1}/10</div>
                      )}
                      {attendance.danh_gia_2 && (
                        <div>Hoàn thành: {attendance.danh_gia_2}/10</div>
                      )}
                      {attendance.danh_gia_3 && (
                        <div>Hiểu bài: {attendance.danh_gia_3}/10</div>
                      )}
                      {attendance.danh_gia_4 && (
                        <div>Tập trung: {attendance.danh_gia_4}/10</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentAttendanceTab;
