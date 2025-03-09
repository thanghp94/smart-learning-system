
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Calendar, School, Database } from "lucide-react";
import { Grid, PieChart, BarChart, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { isInitialized, isLoading, initializeDatabase } = useDatabase();
  const [dbCheckStatus, setDbCheckStatus] = useState<string>("idle");
  const [dbConnectionSuccess, setDbConnectionSuccess] = useState<boolean | null>(null);
  const [tablesData, setTablesData] = useState<Record<string, number>>({});
  const { toast } = useToast();

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

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      setDbCheckStatus("checking");
      // Simple connection check
      const { data, error } = await supabase.from('facilities').select('count');
      
      if (error) {
        console.error("Database connection error:", error);
        setDbConnectionSuccess(false);
        setTablesData({});
      } else {
        setDbConnectionSuccess(true);
        // If connection successful, check table data counts
        await checkTableData();
      }
    } catch (error) {
      console.error("Unexpected error checking database:", error);
      setDbConnectionSuccess(false);
    } finally {
      setDbCheckStatus("complete");
    }
  };

  const checkTableData = async () => {
    const tables = ['facilities', 'classes', 'students', 'employees', 'teaching_sessions'];
    const counts: Record<string, number> = {};

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count');
        if (!error && data) {
          counts[table] = data[0]?.count || 0;
        } else {
          counts[table] = -1; // Error
        }
      } catch {
        counts[table] = -1;
      }
    }

    setTablesData(counts);
  };

  const handleInitDatabase = async () => {
    try {
      await initializeDatabase();
      toast({
        title: "Khởi tạo dữ liệu",
        description: "Đã khởi tạo dữ liệu mẫu thành công",
      });
      // Recheck connection after initialization
      setTimeout(checkDatabaseConnection, 1000);
    } catch (error) {
      console.error("Error initializing database:", error);
      toast({
        title: "Lỗi khởi tạo",
        description: "Không thể khởi tạo dữ liệu mẫu",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col items-center text-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Hệ Thống Quản Lý Giáo Dục</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mb-6">
          Hệ thống toàn diện để quản lý lớp học, học sinh, giáo viên, và các hoạt động giáo dục
        </p>

        {/* Database Connection Status */}
        <div className="w-full max-w-2xl mb-4">
          <Alert className={dbConnectionSuccess === true ? "bg-green-50 border-green-200" : 
                           dbConnectionSuccess === false ? "bg-red-50 border-red-200" : 
                           "bg-yellow-50 border-yellow-200"}>
            <div className="flex items-center">
              {dbConnectionSuccess === true ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : dbConnectionSuccess === false ? (
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
              ) : (
                <RefreshCw className={`h-5 w-5 text-yellow-500 mr-2 ${dbCheckStatus === "checking" ? "animate-spin" : ""}`} />
              )}
              <AlertTitle>
                {dbConnectionSuccess === true ? "Kết nối cơ sở dữ liệu thành công" : 
                 dbConnectionSuccess === false ? "Không thể kết nối đến cơ sở dữ liệu" : 
                 "Đang kiểm tra kết nối..."}
              </AlertTitle>
            </div>
            
            {dbConnectionSuccess === false && (
              <AlertDescription className="mt-2">
                <div className="flex flex-col gap-2">
                  <p>Không thể kết nối đến cơ sở dữ liệu Supabase. Vui lòng kiểm tra cấu hình kết nối.</p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={checkDatabaseConnection}
                      disabled={dbCheckStatus === "checking"}
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${dbCheckStatus === "checking" ? "animate-spin" : ""}`} />
                      Kiểm tra lại
                    </Button>
                    <Button size="sm" onClick={handleInitDatabase} disabled={isLoading}>
                      {isLoading ? "Đang khởi tạo..." : "Khởi tạo dữ liệu mẫu"}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            )}
            
            {dbConnectionSuccess === true && (
              <AlertDescription className="mt-2">
                <div className="text-sm">
                  <p className="mb-1">Số lượng bản ghi trong các bảng:</p>
                  <ul className="grid grid-cols-2 gap-1">
                    {Object.entries(tablesData).map(([table, count]) => (
                      <li key={table} className="flex items-center">
                        <span className="font-medium mr-1">{table}:</span> 
                        {count >= 0 ? count : "Lỗi"}
                      </li>
                    ))}
                  </ul>
                  {Object.values(tablesData).some(count => count === 0) && (
                    <div className="mt-3">
                      <Button size="sm" onClick={handleInitDatabase} disabled={isLoading}>
                        {isLoading ? "Đang khởi tạo..." : "Khởi tạo dữ liệu mẫu"}
                      </Button>
                    </div>
                  )}
                </div>
              </AlertDescription>
            )}
          </Alert>
        </div>
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
              <Button variant="outline" size="sm" onClick={(e) => {
                e.stopPropagation();
                navigate(feature.path);
              }}>
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
