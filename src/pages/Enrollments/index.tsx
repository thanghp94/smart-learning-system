
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { enrollmentService, classService, studentService } from "@/lib/supabase";
import { Enrollment, Student, Class } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import EnrollmentForm from "./EnrollmentForm";
import { supabase } from "@/lib/supabase/client";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch enrollments from the database
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('*');
      
      if (enrollmentsError) {
        console.error("Error fetching enrollments:", enrollmentsError);
        throw enrollmentsError;
      }
      
      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');
      
      if (studentsError) {
        console.error("Error fetching students:", studentsError);
        throw studentsError;
      }
      
      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*');
      
      if (classesError) {
        console.error("Error fetching classes:", classesError);
        throw classesError;
      }
      
      setEnrollments(enrollmentsData || []);
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
  };

  const openAddSheet = () => {
    setIsAddSheetOpen(true);
  };

  const closeAddSheet = () => {
    setIsAddSheetOpen(false);
  };

  const handleAddEnrollment = async (data: Partial<Enrollment>) => {
    try {
      const { data: newEnrollment, error } = await supabase
        .from('enrollments')
        .insert(data)
        .select()
        .single();
      
      if (error) {
        console.error("Error adding enrollment:", error);
        toast({
          title: "Lỗi",
          description: "Không thể thêm ghi danh mới",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Thành công",
        description: "Thêm ghi danh mới thành công",
      });
      
      setEnrollments([...enrollments, newEnrollment as Enrollment]);
      closeAddSheet();
    } catch (error) {
      console.error("Error in handleAddEnrollment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm ghi danh mới",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Học sinh",
      key: "hoc_sinh_id",
      sortable: true,
      render: (value: string) => {
        const student = students.find(s => s.id === value);
        return <span>{student?.ten_hoc_sinh || value}</span>;
      }
    },
    {
      title: "Lớp",
      key: "lop_chi_tiet_id",
      sortable: true,
      render: (value: string) => {
        const class_ = classes.find(c => c.id === value);
        return <span>{class_?.ten_lop_full || value}</span>;
      }
    },
    {
      title: "Trạng thái điểm danh",
      key: "tinh_trang_diem_danh",
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === "present" ? "success" : 
          value === "absent" ? "destructive" : 
          value === "late" ? "warning" : 
          "secondary"
        }>
          {value === "present" ? "Có mặt" : 
           value === "absent" ? "Vắng mặt" : 
           value === "late" ? "Đi trễ" : value}
        </Badge>
      )
    },
    {
      title: "Ghi chú",
      key: "ghi_chu",
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchData}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={openAddSheet}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Ghi Danh
      </Button>
    </div>
  );

  if (enrollments.length === 0 && !isLoading) {
    return (
      <PlaceholderPage
        title="Ghi Danh"
        description="Quản lý danh sách ghi danh học sinh vào lớp học"
        addButtonAction={openAddSheet}
      />
    );
  }

  return (
    <TablePageLayout
      title="Ghi Danh"
      description="Quản lý danh sách ghi danh học sinh vào lớp học"
      actions={tableActions}
    >
      <DataTable
        columns={columns}
        data={enrollments}
        isLoading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm ghi danh..."
      />

      {/* Add Enrollment Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Thêm Ghi Danh Mới</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <EnrollmentForm 
              onSubmit={handleAddEnrollment} 
              students={students}
              classes={classes}
            />
          </div>
        </SheetContent>
      </Sheet>
    </TablePageLayout>
  );
};

export default Enrollments;
