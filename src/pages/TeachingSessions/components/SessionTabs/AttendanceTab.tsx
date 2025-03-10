
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Info } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface Student {
  id: string;
  name: string;
  attendance?: string;
  time?: string;
  notes?: string;
}

interface AttendanceTabProps {
  sessionId?: string;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ sessionId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // In a real application, we would fetch the actual attendance data here
    const dummyData: Student[] = [
      { id: '1', name: 'Nguyễn Văn A', attendance: 'present', time: '08:00', notes: 'Đúng giờ' },
      { id: '2', name: 'Trần Thị B', attendance: 'late', time: '08:15', notes: 'Đi muộn 15 phút' },
      { id: '3', name: 'Lê Văn C', attendance: 'absent', time: '-', notes: 'Phụ huynh xin phép' },
    ];
    setStudents(dummyData);
  }, [sessionId]);

  const getAttendanceStatus = (status?: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Có mặt</Badge>;
      case 'late':
        return <Badge variant="warning">Đi muộn</Badge>;
      case 'absent':
        return <Badge variant="destructive">Vắng mặt</Badge>;
      default:
        return <Badge variant="outline">Chưa điểm danh</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Điểm danh</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[200px]">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Điểm danh</CardTitle>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học sinh</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{getAttendanceStatus(student.attendance)}</TableCell>
                  <TableCell>
                    {student.time !== '-' && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{student.time}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.notes && (
                      <div className="flex items-center text-muted-foreground">
                        <Info className="h-3 w-3 mr-1" />
                        <span>{student.notes}</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Dữ liệu điểm danh sẽ hiển thị ở đây
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceTab;
