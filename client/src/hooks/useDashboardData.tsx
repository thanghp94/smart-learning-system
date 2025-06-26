
import { useState, useEffect } from 'react';

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
        const studentsResponse = await fetch('/api/students');
        const studentsData = studentsResponse.ok ? await studentsResponse.json() : [];

        // Fetch classes count
        const classesResponse = await fetch('/api/classes');
        const classesData = classesResponse.ok ? await classesResponse.json() : [];

        // Fetch employees count
        const employeesResponse = await fetch('/api/employees');
        const employeesData = employeesResponse.ok ? await employeesResponse.json() : [];

        // Fetch sessions count
        const sessionsResponse = await fetch('/api/teaching-sessions');
        const sessionsData = sessionsResponse.ok ? await sessionsResponse.json() : [];

        setCountData({
          students: studentsData.length || 0,
          classes: classesData.length || 0,
          employees: employeesData.length || 0,
          sessions: sessionsData.length || 0
        });
        
        // For now, set activities to empty array since we don't have an activities table yet
        setActivities([]);
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
