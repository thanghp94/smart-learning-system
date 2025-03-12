
import React from 'react';
import EnrollmentActions from './EnrollmentActions';
import EnrollmentFilters from './EnrollmentFilters';

interface EnrollmentActionHeaderProps {
  onFilterChange: (field: string, value: string) => void;
  filters: Record<string, string>;
  onReset: () => void;
  onRefresh: () => void;
  onAdd: () => void;
}

const EnrollmentActionHeader: React.FC<EnrollmentActionHeaderProps> = ({
  onFilterChange,
  filters,
  onReset,
  onRefresh,
  onAdd
}) => {
  return (
    <div className="flex items-center space-x-2">
      <EnrollmentFilters 
        onFilterChange={onFilterChange} 
        filters={filters} 
        onReset={onReset} 
      />
      <EnrollmentActions onRefresh={onRefresh} onAdd={onAdd} />
    </div>
  );
};

export default EnrollmentActionHeader;
