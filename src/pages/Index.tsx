
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useToast } from "@/hooks/use-toast";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { toast } = useToast();
  const { isInitialized, isLoading, initializeDatabase } = useDatabase();

  const handleInitializeClick = async () => {
    try {
      await initializeDatabase();
      toast({
        title: "Database initialized",
        description: "The database has been successfully initialized.",
      });
    } catch (error) {
      console.error("Error initializing database:", error);
      toast({
        title: "Initialization failed",
        description: "There was an error initializing the database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Học Sinh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              +2 từ tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lớp Hoạt Động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +1 từ tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Buổi Dạy / Tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              +6% từ tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh Thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,000,000đ</div>
            <p className="text-xs text-muted-foreground">
              +12% từ tháng trước
            </p>
          </CardContent>
        </Card>
      </div>
      
      {!isInitialized && (
        <Card className="mt-4 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-yellow-800">
              Cơ sở dữ liệu chưa được khởi tạo
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Để sử dụng đầy đủ chức năng của hệ thống, hãy khởi tạo cơ sở dữ liệu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleInitializeClick} 
              disabled={isLoading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isLoading ? "Đang khởi tạo..." : "Khởi tạo CSDL"}
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Thống Kê</TabsTrigger>
          <TabsTrigger value="reports">Báo Cáo</TabsTrigger>
          <TabsTrigger value="activity">Hoạt Động</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biểu Đồ Học Sinh Theo Lớp</CardTitle>
              <CardDescription>
                Số lượng học sinh trong mỗi lớp học
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
              <p className="text-muted-foreground">Biểu đồ học sinh sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Doanh Thu Theo Thời Gian</CardTitle>
                <CardDescription>
                  Biểu đồ doanh thu theo tháng
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Phân Bố Học Sinh</CardTitle>
                <CardDescription>
                  Phân bố học sinh theo độ tuổi
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Biểu đồ phân bố sẽ hiển thị ở đây</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo Cáo Tháng</CardTitle>
              <CardDescription>
                Tổng hợp các báo cáo theo tháng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Báo cáo sẽ hiển thị ở đây</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt Động Gần Đây</CardTitle>
              <CardDescription>
                Hoạt động trong hệ thống trong 30 ngày qua
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
