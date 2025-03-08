
import React from "react";
import { DASHBOARD_STATS } from "@/lib/constants";
import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/common/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample chart data
const chartData = [
  { name: "T1", students: 200, revenue: 5000 },
  { name: "T2", students: 220, revenue: 5200 },
  { name: "T3", students: 230, revenue: 5400 },
  { name: "T4", students: 245, revenue: 5800 },
  { name: "T5", students: 256, revenue: 6000 },
];

const Index = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Tổng quan"
        description="Chào mừng đến với Hệ thống quản lý giáo dục thông minh."
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_STATS.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Thống kê học sinh</CardTitle>
            <CardDescription>Tổng số học sinh theo tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Doanh thu</CardTitle>
            <CardDescription>Doanh thu theo tháng (triệu VND)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <RecentActivity />
    </div>
  );
};

export default Index;
