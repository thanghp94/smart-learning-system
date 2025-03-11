
export interface FilterOption {
  label: string;
  value: string;
  type: 'status' | 'date' | 'other' | 'category' | 'student' | 'employee' | 'facility' | 'tuition';
}

export interface FilterGroupProps {
  label: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  value: string;
}

export interface FilterButtonProps {
  filters: Array<{
    label: string;
    options: FilterOption[];
  }>;
  onChange: (type: string, value: string) => void;
  values: Record<string, string>;
}
