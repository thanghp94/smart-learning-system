
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassById } from "@/lib/supabase/class-service";
import { Class, Employee, Enrollment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, School } from "lucide-react";
import DetailPanel from "@/components/ui/DetailPanel";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Sample data for demo mode
const sampleClass: Class = {
  id: "1",
  Ten_lop_full: "Toán Nâng Cao 10A",
  ten_lop: "10A",
  ct_hoc: "Toán",
  co_so: "1",
  GV_chinh: "1",
  ngay_bat_dau: "2023-09-01",
  tinh_trang: "active",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const sampleTeacher: Employee = {
  id: "1",
  ten_nhan_su: "Nguyễn Văn A",
  dien_thoai: "0123456789",
  email: "teacher@example.com",
  tinh_trang_lao_dong: "active",
  dia_chi: "Hà Nội",
  bo_phan: "Giáo viên",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const sampleEnrollments: Enrollment[] = [
  {
    id: "1",
    hoc_sinh_id: "1",
    lop_chi_tiet_id: "1",
    tinh_trang_diem_danh: "present",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    hoc_sinh_id: "2",
    lop_chi_tiet_id: "1",
    tinh_trang_diem_danh: "absent",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [classData, setClassData] = useState<Class | null>(null);
  const [teacher, setTeacher] = useState<Employee | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    const fetchClassDetail = async () => {
      setLoading(true);
      try {
        if (isDemoMode) {
          // Use sample data in demo mode
          setClassData(sampleClass);
          setTeacher(sampleTeacher);
          setEnrollments(sampleEnrollments);
        } else if (id) {
          // Fetch real data if not in demo mode
          const result = await getClassById(id);
          if (result.data) {
            setClassData(result.data);
            // In a real app, you would fetch teacher and enrollments here
          } else {
            toast({
              title: "Error",
              description: "Failed to load class details",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching class details:", error);
        toast({
          title: "Error",
          description: "Failed to load class details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetail();
  }, [id, toast, isDemoMode]);

  const handleBack = () => {
    navigate("/classes");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="container mx-auto p-4">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classes
        </Button>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Class not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classes
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">{classData.Ten_lop_full}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center">
                  <School className="mr-2 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Program</p>
                    <p className="font-medium">{classData.ct_hoc}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {classData.ngay_bat_dau 
                        ? format(new Date(classData.ngay_bat_dau), 'dd/MM/yyyy') 
                        : 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Main Teacher</p>
                    <p className="font-medium">{teacher?.ten_nhan_su || 'Not assigned'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <School className="mr-2 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{classData.tinh_trang}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <DetailPanel 
            title="Student Enrollments" 
            items={[
              { label: "Number of Students", value: enrollments.length.toString() },
            ]}
          >
            <div className="space-y-4 mt-4">
              {enrollments.length > 0 ? (
                enrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Student ID: {enrollment.hoc_sinh_id}</p>
                          <p className="text-sm text-muted-foreground">
                            Attendance: {enrollment.tinh_trang_diem_danh}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No students enrolled</p>
              )}
            </div>
          </DetailPanel>
        </div>
        
        <div className="space-y-6">
          <DetailPanel 
            title="Class Information" 
            items={[
              { label: "Class Name", value: classData.ten_lop },
              { label: "Full Name", value: classData.Ten_lop_full },
              { label: "Curriculum", value: classData.ct_hoc || "Not specified" },
              { label: "Status", value: classData.tinh_trang },
              { label: "Start Date", value: classData.ngay_bat_dau ? format(new Date(classData.ngay_bat_dau), 'dd/MM/yyyy') : 'Not set' },
            ]}
          />
          
          {teacher && (
            <DetailPanel 
              title="Teacher Information" 
              items={[
                { label: "Name", value: teacher.ten_nhan_su },
                { label: "Contact", value: teacher.dien_thoai || "Not available" },
                { label: "Email", value: teacher.email || "Not available" },
                { label: "Department", value: teacher.bo_phan || "Not specified" },
                { label: "Status", value: teacher.tinh_trang_lao_dong || "Not specified" },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
