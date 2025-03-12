
import { useState, useEffect, useCallback } from 'react';
import { enrollmentService, classService, studentService } from '@/lib/supabase';
import { Enrollment, Student, Class } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useEnrollmentData = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({
    classId: '',
    facilityId: ''
  });
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching enrollment data...');
      
      const [enrollmentsData, studentsData, classesData] = await Promise.all([
        enrollmentService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ]);
      
      console.log('Enrollment data loaded:', enrollmentsData?.length || 0);
      console.log('Students data loaded:', studentsData?.length || 0);
      console.log('Classes data loaded:', classesData?.length || 0);
      
      setEnrollments(enrollmentsData || []);
      setFilteredEnrollments(enrollmentsData || []);
      setStudents(studentsData || []);
      setClasses(classesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu ghi danh",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!enrollments.length) return;
    console.log('Applying enrollment filters:', filters);
    
    let filtered = [...enrollments];
    
    if (filters.classId) {
      console.log('Filtering by class ID:', filters.classId);
      filtered = filtered.filter(enrollment => enrollment.lop_chi_tiet_id === filters.classId);
    }
    
    // For facility filter, we need to check the class facility
    if (filters.facilityId) {
      console.log('Filtering by facility ID:', filters.facilityId);
      const classesInFacility = classes.filter(cls => cls.co_so === filters.facilityId).map(cls => cls.id);
      console.log('Classes in facility:', classesInFacility.length);
      filtered = filtered.filter(enrollment => classesInFacility.includes(enrollment.lop_chi_tiet_id));
    }
    
    console.log('Filtered enrollments:', filtered.length);
    setFilteredEnrollments(filtered);
  }, [enrollments, filters, classes]);

  const handleFilterChange = (field: string, value: string) => {
    console.log('Enrollment filter changed:', field, value);
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    console.log('Resetting enrollment filters');
    setFilters({
      classId: '',
      facilityId: ''
    });
  };

  return {
    enrollments,
    filteredEnrollments,
    isLoading,
    isSubmitting,
    students,
    classes,
    filters,
    setIsSubmitting,
    fetchData,
    handleFilterChange,
    handleResetFilters
  };
};
