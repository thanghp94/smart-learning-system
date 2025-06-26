
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, PlusCircle } from 'lucide-react';
import AdmissionFilters from '../AdmissionFilters';
import { Facility } from '@/lib/types';

interface KanbanHeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  facilityFilter: string;
  setFacilityFilter: (value: string) => void;
  facilities: Facility[];
  handleResetFilters: () => void;
  refresh: () => void;
  handleOpenForm: () => void;
}

const KanbanHeader: React.FC<KanbanHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  facilityFilter,
  setFacilityFilter,
  facilities,
  handleResetFilters,
  refresh,
  handleOpenForm
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <AdmissionFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        facilityFilter={facilityFilter}
        setFacilityFilter={setFacilityFilter}
        facilities={facilities}
        handleResetFilters={handleResetFilters}
      />
      <div className="flex space-x-2">
        <Button variant="outline" onClick={refresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Tải lại
        </Button>
        <Button onClick={handleOpenForm}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm mới
        </Button>
      </div>
    </div>
  );
};

export default KanbanHeader;
