
import { ActivityItem } from './activity';

export interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
  iconComponent?: React.ReactNode;
  trend?: {
    value: string;
    direction: string;
    text: string;
  };
  className?: string;
}

export interface TableColumn {
  title: string;
  key: string;
  render?: (value: any, record?: any) => JSX.Element | React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn[];
  onRowClick?: (record: T) => void;
  isLoading?: boolean;
  pagination?: {
    pageSize: number;
    current: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  searchable?: boolean;
  searchPlaceholder?: string;
}

export interface RecentActivityProps {
  activities: ActivityItem[];
}
