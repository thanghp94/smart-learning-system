
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Download, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  file_url?: string;
  created_at: string;
  status: string;
}

interface AssignmentListProps {
  sessionId: string;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ sessionId }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        // This would be a real API call in production
        // const data = await assignmentService.getBySessionId(sessionId);
        
        // Dummy data for now
        const dummyData: Assignment[] = [
          {
            id: '1',
            title: 'Bài tập về nhà 1',
            description: 'Hoàn thành các bài tập trong trang 15-17',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            file_url: 'https://example.com/assignment1.pdf',
            created_at: new Date().toISOString(),
            status: 'active'
          },
          {
            id: '2',
            title: 'Bài kiểm tra nhanh',
            description: 'Kiểm tra kiến thức đã học trong buổi này',
            due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            status: 'active'
          }
        ];
        
        setAssignments(dummyData);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách bài tập. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [sessionId, toast]);

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Đang tải danh sách bài tập...
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Chưa có bài tập nào được tạo
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-grow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">{assignment.title}</h3>
                  <Badge variant="outline">Hạn: {format(new Date(assignment.due_date), 'dd/MM/yyyy')}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{assignment.description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Tạo lúc: {format(new Date(assignment.created_at), 'dd/MM/yyyy HH:mm')}
                </div>
              </div>
              <div className="flex sm:flex-col justify-end items-center bg-muted p-4 gap-2">
                {assignment.file_url && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Tải
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" /> Xem
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AssignmentList;
