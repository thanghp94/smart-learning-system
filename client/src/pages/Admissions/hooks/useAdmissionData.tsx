
import { useState, useEffect, useCallback } from 'react';
import { admissionService } from "@/lib/database";
import { employeeService, facilityService } from "@/lib/database";
import { Admission, AdmissionStatus } from '@/lib/types/admission';
import { useToast } from '@/hooks/use-toast';
import { Facility } from '@/lib/types';

export const useAdmissionData = () => {
  const { toast } = useToast();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState<Admission[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch admissions data
  useEffect(() => {
    const fetchAdmissions = async () => {
      setIsLoading(true);
      try {
        const data = await admissionService.getAdmissions();
        console.log('Fetched admissions:', data);
        setAdmissions(data);
        setFilteredAdmissions(data);
      } catch (error) {
        console.error('Error fetching admissions:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu tuyển sinh',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmissions();
  }, [refreshTrigger, toast]);

  // Fetch employees and facilities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesData, facilitiesData] = await Promise.all([
          employeeService.getEmployees(),
          facilityService.getFacilities()
        ]);
        console.log('Fetched employees:', employeesData?.length || 0);
        console.log('Fetched facilities:', facilitiesData?.length || 0);
        setEmployees(employeesData || []);
        setFacilities(facilitiesData || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    fetchData();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    let filtered = admissions;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(admission => 
        admission.ten_hoc_sinh?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        admission.ten_phu_huynh?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        admission.so_dien_thoai?.includes(searchQuery) || 
        admission.so_dien_thoai_phu_huynh?.includes(searchQuery)
      );
    }
    
    // Apply facility filter
    if (facilityFilter && facilityFilter !== 'all') {
      filtered = filtered.filter(admission => admission.co_so === facilityFilter);
    }
    
    console.log('Filtered admissions count:', filtered.length);
    setFilteredAdmissions(filtered);
  }, [admissions, searchQuery, facilityFilter]);

  // Filter admissions by status
  const getAdmissionsByStatus = (status: AdmissionStatus) => {
    return filteredAdmissions.filter(a => a.trang_thai === status);
  };

  const handleDragStart = (e: React.DragEvent, admission: Admission) => {
    e.dataTransfer.setData('admissionId', admission.id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = async (e: React.DragEvent, status: AdmissionStatus) => {
    e.preventDefault();
    const admissionId = e.dataTransfer.getData('admissionId');

    // Find the admission that was dragged
    const admission = admissions.find(a => a.id === admissionId);
    if (!admission || admission.trang_thai === status) return;

    // Update status in UI first for responsive feel
    setAdmissions(prev => prev.map(a => a.id === admissionId ? {
      ...a,
      trang_thai: status
    } : a));

    // Then update in database
    try {
      await admissionService.updateAdmissionStatus(admissionId, status);
      toast({
        title: 'Cập nhật trạng thái',
        description: `${admission.ten_hoc_sinh} đã được chuyển sang ${status}`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      // Rollback UI change
      setAdmissions(prev => prev.map(a => a.id === admissionId ? {
        ...a,
        trang_thai: admission.trang_thai
      } : a));
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái',
        variant: 'destructive'
      });
    }
  };

  // Get employee name from ID
  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return '';
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.ten_nhan_su : '';
  };

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleResetFilters = () => {
    setFacilityFilter('all');
    setSearchQuery('');
  };

  return {
    admissions,
    filteredAdmissions,
    employees,
    facilities,
    facilityFilter,
    isLoading,
    searchQuery,
    getAdmissionsByStatus,
    handleDragStart,
    handleDragOver,
    handleDrop,
    getEmployeeName,
    refresh,
    handleResetFilters,
    setFacilityFilter,
    setSearchQuery
  };
};
