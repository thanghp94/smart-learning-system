
import React from 'react';
import { BarChart, AreaChart } from 'recharts';

// Simple chart components using recharts
export const SimpleBarChart = ({ data }: { data: any[] }) => (
  <div className="h-80">
    <BarChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      {/* Add chart components here if needed */}
    </BarChart>
  </div>
);

export const SimpleAreaChart = ({ data }: { data: any[] }) => (
  <div className="h-80">
    <AreaChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      {/* Add chart components here if needed */}
    </AreaChart>
  </div>
);
