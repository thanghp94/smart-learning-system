
import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Facility } from '@/lib/types';

interface AdmissionFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  facilityFilter: string;
  setFacilityFilter: (value: string) => void;
  facilities: Facility[];
  handleResetFilters: () => void;
}

const AdmissionFilters: React.FC<AdmissionFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  facilityFilter,
  setFacilityFilter,
  facilities,
  handleResetFilters
}) => {
  return (
    <div className="flex space-x-2">
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Tìm kiếm học sinh..." 
          className="pl-8" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2 bg-background border rounded-md p-1">
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs font-normal" disabled>
          <Filter className="h-3.5 w-3.5" />
          Cơ sở
        </Button>
        
        <Select value={facilityFilter} onValueChange={setFacilityFilter}>
          <SelectTrigger className="h-8 w-[180px] text-xs">
            <SelectValue placeholder="Theo cơ sở" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả cơ sở</SelectItem>
            {facilities.map(facility => (
              <SelectItem key={facility.id} value={facility.id}>
                {facility.ten_co_so}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {facilityFilter && facilityFilter !== 'all' && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={handleResetFilters}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Đặt lại
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdmissionFilters;
