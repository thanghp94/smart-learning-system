
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layers, CalendarDays, Scroll, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface StudentEnrollmentsTabProps {
  enrollments: any[];
}

const StudentEnrollmentsTab: React.FC<StudentEnrollmentsTabProps> = ({ enrollments }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có thông tin';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return dateString;
    }
  };
  
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Chưa có thông tin';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layers className="mr-2 h-5 w-5" />
          Lớp đã ghi danh
        </CardTitle>
      </CardHeader>
      <CardContent>
        {enrollments.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">Học sinh chưa ghi danh vào lớp nào</p>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="p-3 border rounded-md">
                <Link 
                  to={`/classes/${enrollment.lop_chi_tiet_id}`} 
                  className="font-medium hover:underline text-blue-600"
                >
                  {enrollment.ten_lop_full || enrollment.ten_lop || 'Lớp không xác định'}
                </Link>
                
                {enrollment.ct_hoc && (
                  <div className="text-sm text-muted-foreground mt-1 flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Chương trình: {enrollment.ct_hoc}
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  Ngày ghi danh: {enrollment.created_at ? formatDate(enrollment.created_at) : 'Không có ngày'}
                </div>
                
                {enrollment.tong_tien && (
                  <div className="text-sm mt-1 flex items-center">
                    <Scroll className="h-3 w-3 mr-1" />
                    Học phí: {formatCurrency(enrollment.tong_tien)}
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

export default StudentEnrollmentsTab;
