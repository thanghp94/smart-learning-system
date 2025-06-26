
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  UserPlus, 
  UserMinus, 
  GraduationCap, 
  DollarSign, 
  Book 
} from 'lucide-react';
import { format } from 'date-fns';

interface ActivityProps {
  activities: any[];
}

const RecentActivity: React.FC<ActivityProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Không có hoạt động gần đây
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'student':
        return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case 'finance':
        return <DollarSign className="h-5 w-5 text-yellow-500" />;
      case 'class':
        return <Book className="h-5 w-5 text-purple-500" />;
      case 'employee':
        return <UserMinus className="h-5 w-5 text-red-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id || index} className="flex items-start gap-4 p-2 rounded-lg hover:bg-accent">
            <div className="bg-muted p-2 rounded-full">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{activity.title || 'Hoạt động không tiêu đề'}</p>
              <p className="text-sm text-muted-foreground">{activity.description || 'Không có mô tả'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.timestamp ? format(new Date(activity.timestamp), 'dd/MM/yyyy HH:mm') : 'Không có thời gian'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default RecentActivity;
