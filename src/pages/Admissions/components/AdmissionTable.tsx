
import React, { useState, useEffect } from 'react';
import { admissionService } from '@/lib/supabase';
import { Admission } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const AdmissionTable: React.FC = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setIsLoading(true);
        const data = await admissionService.getAll();
        setAdmissions(data);
      } catch (error) {
        console.error('Error fetching admissions:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu tuyển sinh',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmissions();
  }, [toast]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'inquiry':
        return 'Yêu cầu';
      case 'contacted':
        return 'Đã liên hệ';
      case 'applied':
        return 'Đã nộp đơn';
      case 'interviewed':
        return 'Đã phỏng vấn';
      case 'offered':
        return 'Đã đề nghị';
      case 'enrolled':
        return 'Đã nhập học';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Đang tải...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              admissions.map((admission) => (
                <TableRow key={admission.id}>
                  <TableCell>{admission.ho_ten}</TableCell>
                  <TableCell>
                    {admission.ngay_sinh ? format(new Date(admission.ngay_sinh), 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>{admission.so_dien_thoai || 'N/A'}</TableCell>
                  <TableCell>{admission.email || 'N/A'}</TableCell>
                  <TableCell>{getStatusLabel(admission.trang_thai || '')}</TableCell>
                  <TableCell>
                    {admission.created_at ? format(new Date(admission.created_at), 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdmissionTable;
