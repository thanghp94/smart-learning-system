
import { useMemo } from 'react';

export const useDashboardChartData = () => {
  const studentData = useMemo(() => [
    { name: 'Tháng 1', total: 53 },
    { name: 'Tháng 2', total: 55 },
    { name: 'Tháng 3', total: 59 },
    { name: 'Tháng 4', total: 62 },
    { name: 'Tháng 5', total: 65 },
    { name: 'Tháng 6', total: 72 },
    { name: 'Tháng 7', total: 78 },
    { name: 'Tháng 8', total: 82 },
    { name: 'Tháng 9', total: 88 },
    { name: 'Tháng 10', total: 91 },
    { name: 'Tháng 11', total: 94 },
    { name: 'Tháng 12', total: 98 },
  ], []);

  const classesData = useMemo(() => [
    { name: 'Tháng 1', total: 12 },
    { name: 'Tháng 2', total: 13 },
    { name: 'Tháng 3', total: 15 },
    { name: 'Tháng 4', total: 15 },
    { name: 'Tháng 5', total: 16 },
    { name: 'Tháng 6', total: 17 },
    { name: 'Tháng 7', total: 18 },
    { name: 'Tháng 8', total: 19 },
    { name: 'Tháng 9', total: 20 },
    { name: 'Tháng 10', total: 21 },
    { name: 'Tháng 11', total: 22 },
    { name: 'Tháng 12', total: 24 },
  ], []);

  return { studentData, classesData };
};

export default useDashboardChartData;
