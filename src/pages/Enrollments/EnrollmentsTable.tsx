import React, { useState, useEffect } from 'react';
import { Enrollment } from '@/lib/types';
import { DataTable } from '@/components/ui/DataTable';
import { enrollmentService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface EnrollmentsTableProps {
  classId: string;
  sessionId?: string;
}

const EnrollmentsTable: React.FC<EnrollmentsTableProps> = ({ classId, sessionId }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        let data;
        
        if (sessionId) {
          data = await enrollmentService.getByClassAndSession(classId, sessionId);
        } else {
          data = await enrollmentService.getByClass(classId);
        }
        
        setEnrollments(data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        toast({
          title: 'Error',
          description: 'Could not load enrollments',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (classId) {
      fetchEnrollments();
    }
  }, [classId, sessionId]);

  const columns = [
    {
      title: "Học sinh",
      key: "ten_hoc_sinh",
      sortable: true,
    },
    {
      title: "Tình trạng",
      key: "tinh_trang_diem_danh",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "present" ? "success" : value === "absent" ? "destructive" : "outline"}>
          {value === "present" ? "Có mặt" : 
           value === "absent" ? "Vắng mặt" : 
           value === "late" ? "Đi muộn" : "Chưa điểm danh"}
        </Badge>
      ),
    },
    {
      title: "Ghi chú",
      key: "ghi_chu",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={enrollments}
      isLoading={loading}
      searchable={true}
      searchPlaceholder="Tìm kiếm học sinh..."
    />
  );
};

export default EnrollmentsTable;
