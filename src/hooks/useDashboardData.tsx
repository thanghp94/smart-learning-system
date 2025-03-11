
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface CountData {
  students: number;
  classes: number;
  employees: number;
  sessions: number;
}

export const useDashboardData = () => {
  const [countData, setCountData] = useState<CountData>({
    students: 0,
    classes: 0,
    employees: 0,
    sessions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        // Fetch students count
        const { count: studentsCount, error: studentsError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true });

        // Fetch classes count
        const { count: classesCount, error: classesError } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true });

        // Fetch employees count
        const { count: employeesCount, error: employeesError } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true });

        // Fetch sessions count
        const { count: sessionsCount, error: sessionsError } = await supabase
          .from('teaching_sessions')
          .select('*', { count: 'exact', head: true });

        // Fetch recent activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);

        if (studentsError || classesError || employeesError || sessionsError) {
          console.error("Error fetching counts");
        } else {
          setCountData({
            students: studentsCount || 0,
            classes: classesCount || 0,
            employees: employeesCount || 0,
            sessions: sessionsCount || 0
          });
          setActivities(activitiesData || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { countData, isLoading, activities };
};

export default useDashboardData;
