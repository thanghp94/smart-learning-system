import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CreditCard, User2Icon } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from '@/hooks/use-toast';

const PersonalDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
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

    fetchPersonalData();
  }, []);

  return (
    <div className="container mx-auto py-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        employee && (
          <>
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold">{employee.ten_nhan_su}</h1>
                  <p className="text-muted-foreground">{employee.chuc_danh} ({employee.bo_phan})</p>
                </div>
                
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Ngày sinh:</span>
                    <span>{employee.ngay_sinh ? format(new Date(employee.ngay_sinh), 'dd/MM/yyyy') : 'N/A'}</span>
                    
                    <span className="font-medium">Điện thoại:</span>
                    <span>{employee.dien_thoai || 'N/A'}</span>
                    
                    <span className="font-medium">Email:</span>
                    <span>{employee.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Số ngày làm việc</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">22</div>
                    <p className="text-sm text-muted-foreground">Tháng 8</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lương</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8,000,000 VNĐ</div>
                    <p className="text-sm text-muted-foreground">Đã thanh toán</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Thông tin cá nhân</CardTitle>
                    <User2Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p><strong>Chức danh:</strong> {employee.chuc_danh}</p>
                      <p><strong>Bộ phận:</strong> {employee.bo_phan}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Công việc hôm nay</h2>
              <ScrollArea className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Soạn giáo án</h3>
                    <Badge variant="secondary">Quan trọng</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Hoàn thành giáo án cho tuần tới.</p>
                </div>
              </ScrollArea>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default PersonalDashboard;
