
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface StudentProgressTabProps {
  studentId: string;
}

const StudentProgressTab: React.FC<StudentProgressTabProps> = ({ studentId }) => {
  // In a real app, this would fetch progress data from the backend
  // For now, we'll use placeholder data
  const progressData = {
    overall: 75,
    attendance: 90,
    assignments: 70,
    participation: 80,
    achievements: [
      { id: 1, title: 'Perfect Attendance', date: '2023-10-15', description: 'No absences for 3 months' },
      { id: 2, title: 'Academic Excellence', date: '2023-11-10', description: 'Scored above 90% in all tests' },
    ],
    recentAssignments: [
      { id: 1, title: 'Math Homework', status: 'completed', grade: 'A', date: '2023-12-01' },
      { id: 2, title: 'English Essay', status: 'pending', date: '2023-12-10' },
      { id: 3, title: 'Science Project', status: 'completed', grade: 'B+', date: '2023-11-20' },
    ]
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Tổng tiến độ học tập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span>Tổng tiến độ</span>
                <span className="font-semibold">{progressData.overall}%</span>
              </div>
              <Progress value={progressData.overall} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="flex items-center"><Clock className="mr-1 h-4 w-4" /> Điểm danh</span>
                  <span className="font-semibold">{progressData.attendance}%</span>
                </div>
                <Progress value={progressData.attendance} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="flex items-center"><CheckCircle className="mr-1 h-4 w-4" /> Bài tập</span>
                  <span className="font-semibold">{progressData.assignments}%</span>
                </div>
                <Progress value={progressData.assignments} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="flex items-center"><Award className="mr-1 h-4 w-4" /> Tham gia</span>
                  <span className="font-semibold">{progressData.participation}%</span>
                </div>
                <Progress value={progressData.participation} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Thành tích
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progressData.achievements.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Chưa có thành tích nào</p>
            ) : (
              <div className="space-y-4">
                {progressData.achievements.map((achievement) => (
                  <div key={achievement.id} className="border rounded-md p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="outline">{achievement.date}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Bài tập gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progressData.recentAssignments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Không có bài tập nào gần đây</p>
            ) : (
              <div className="space-y-3">
                {progressData.recentAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-xs text-muted-foreground">{assignment.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.grade && (
                        <Badge variant="secondary">{assignment.grade}</Badge>
                      )}
                      <Badge 
                        variant={assignment.status === 'completed' ? 'success' : 'outline'}
                      >
                        {assignment.status === 'completed' ? 'Hoàn thành' : 'Đang chờ'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProgressTab;
