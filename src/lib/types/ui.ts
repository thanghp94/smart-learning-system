
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  type: 'status' | 'date' | 'other' | 'category' | 'student' | 'employee' | 'facility' | 'tuition';
}

export interface FilterProps {
  options: FilterOption[];
  onFilterChange: (filters: Record<string, string[]>) => void;
}
