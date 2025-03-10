
export interface ActivityItem {
  id: string;
  action: string;
  type: string;
  name: string;
  user: string;
  timestamp: string;
  status?: string;
}

// Alias the ActivityItem to Activity for backward compatibility
export type Activity = ActivityItem;
