
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  image: string | null;
  code: string;
}

interface StudentsTabProps {
  students: Student[];
}

const StudentsTab: React.FC<StudentsTabProps> = ({ students }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách học sinh</CardTitle>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(student => (
              <div key={student.id} className="flex items-center p-3 border rounded-md">
                <div className="flex-shrink-0 mr-3">
                  {student.image ? (
                    <img 
                      src={student.image} 
                      alt={student.name} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-slate-500" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <Link to={`/students/${student.id}`} className="text-sm font-medium hover:underline">
                    {student.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">Mã: {student.code}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Chưa có học sinh nào trong lớp này.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentsTab;
