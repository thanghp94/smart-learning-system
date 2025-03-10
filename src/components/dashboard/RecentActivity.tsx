
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/utils/format';

interface Activity {
  id: string;
  action: string;
  type: string;
  name: string;
  timestamp: string;
  username?: string;
}

export interface RecentActivityProps {
  activities: Activity[];
  isLoading?: boolean;
}

const getActionColor = (action: string) => {
  switch (action.toLowerCase()) {
    case 'thêm mới':
      return 'text-green-500';
    case 'cập nhật':
      return 'text-blue-500';
    case 'xóa':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const getAvatarFallback = (type: string) => {
  return type.substring(0, 2).toUpperCase();
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, isLoading = false }) => {
  if (isLoading) {
    return <div className="space-y-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse mr-3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-32 animate-pulse" />
          </div>
        </div>
      ))}
    </div>;
  }

  if (!activities || activities.length === 0) {
    return <div className="text-center text-muted-foreground py-4">
      No recent activities found
    </div>;
  }

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9 mr-3">
            <AvatarImage src="" alt={activity.type} />
            <AvatarFallback>{getAvatarFallback(activity.type)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">
              <span className={getActionColor(activity.action)}>
                {activity.action}
              </span>{' '}
              <span className="font-medium">{activity.type}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {activity.timestamp && formatDate(activity.timestamp)}
              {activity.username && ` by ${activity.username}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
