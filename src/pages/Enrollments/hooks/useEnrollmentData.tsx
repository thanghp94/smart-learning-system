
import { useState, useEffect, useCallback } from 'react';
import { enrollmentService, classService, studentService } from '@/lib/supabase';
import { Enrollment, Student, Class } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

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
      
      // Fetch enrollments with joined student and class data to get names
      const { data: enrollmentsData, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          students:hoc_sinh_id (id, ten_hoc_sinh),
          classes:lop_chi_tiet_id (id, ten_lop_full, ten_lop, ct_hoc)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching enrollments:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu ghi danh",
          variant: "destructive"
        });
        setEnrollments([]);
        setFilteredEnrollments([]);
      } else {
        // Process the joined data to flatten it
        const processedEnrollments = enrollmentsData.map(enrollment => ({
          ...enrollment,
          ten_hoc_sinh: enrollment.students?.ten_hoc_sinh || 'Không có thông tin',
          ten_lop_full: enrollment.classes?.ten_lop_full || 'Không có thông tin',
          ten_lop: enrollment.classes?.ten_lop || 'Không có thông tin',
          ct_hoc: enrollment.classes?.ct_hoc || 'Không có thông tin'
        }));
        
        console.log('Enrollment data loaded:', processedEnrollments.length || 0);
        setEnrollments(processedEnrollments);
        setFilteredEnrollments(processedEnrollments);
      }
      
      // Then try to get students for reference
      let studentsData;
      try {
        studentsData = await studentService.getAll();
        console.log('Students data loaded:', studentsData?.length || 0);
      } catch (error) {
        console.error('Error fetching students:', error);
        studentsData = [];
      }
      
      // Then try to get classes for reference
      let classesData;
      try {
        classesData = await classService.getAll();
        console.log('Classes data loaded:', classesData?.length || 0);
      } catch (error) {
        console.error('Error fetching classes:', error);
        classesData = [];
      }
      
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
