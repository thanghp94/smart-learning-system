
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Calendar, School, Database } from "lucide-react";
import { Grid, PieChart, BarChart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    { title: "Lớp học", icon: <BookOpen className="h-8 w-8" />, path: "/classes", description: "Quản lý thông tin và lịch trình của các lớp học" },
    { title: "Học sinh", icon: <Users className="h-8 w-8" />, path: "/students", description: "Thông tin chi tiết về học sinh trong hệ thống" },
    { title: "Buổi học", icon: <Calendar className="h-8 w-8" />, path: "/teaching-sessions", description: "Theo dõi và đánh giá các buổi dạy" },
    { title: "Nhân viên", icon: <School className="h-8 w-8" />, path: "/employees", description: "Quản lý giáo viên và nhân viên" },
    { title: "Cơ sở vật chất", icon: <Grid className="h-8 w-8" />, path: "/assets", description: "Quản lý tài sản và thiết bị" },
    { title: "Báo cáo", icon: <PieChart className="h-8 w-8" />, path: "/evaluations", description: "Báo cáo và đánh giá hiệu quả" },
    { title: "Tài chính", icon: <BarChart className="h-8 w-8" />, path: "/finance", description: "Quản lý thu chi và tài chính" },
    { title: "Cơ sở dữ liệu", icon: <Database className="h-8 w-8" />, path: "/database-schema", description: "Xem cấu trúc dữ liệu" },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Hệ Thống Quản Lý Giáo Dục</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Hệ thống toàn diện để quản lý lớp học, học sinh, giáo viên, và các hoạt động giáo dục
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(feature.path)}>
            <CardHeader className="flex items-center justify-center pt-6 pb-2">
              <div className="mb-2 p-2 rounded-full bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <CardTitle className="text-xl text-center">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <CardDescription className="mb-4">{feature.description}</CardDescription>
              <Button variant="outline" size="sm" onClick={() => navigate(feature.path)}>
                Xem chi tiết
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-6">Bắt đầu sử dụng hệ thống</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/classes")}>
            Quản lý lớp học
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/students")}>
            Quản lý học sinh
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/teaching-sessions")}>
            Buổi dạy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
