
import React, { useState } from "react";
import TablePageLayout from "@/components/common/TablePageLayout";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import { classService } from "@/lib/supabase";
import { Class } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useDatabase } from "@/contexts/DatabaseContext";
import ClassActionsToolbar from "./components/ClassActionsToolbar";
import ClassesTable from "./components/ClassesTable";
import ClassDetailPanel from "./components/ClassDetailPanel";
import AddClassDialog from "./components/AddClassDialog";
import ClassErrorDialog from "./components/ClassErrorDialog";
import { useClassData } from "./hooks/useClassData";

const Classes = () => {
  const { classes, filteredClasses, isLoading, fetchClasses, handleFilterChange, handleResetFilters } = useClassData();
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const { initializeDatabase, reinitializePolicies } = useDatabase();

  const handleRowClick = (classData: Class) => {
    setSelectedClass(classData);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<Class>) => {
    try {
      console.log("Submitting class data:", formData);
      const classDataToSubmit = {
        ...formData,
        ten_lop_full: formData.ten_lop_full || '',
        ten_lop: formData.ten_lop || '',
        ct_hoc: formData.ct_hoc || ''
      };
      
      const newClass = await classService.create(classDataToSubmit as any);
      console.log("New class created successfully:", newClass);
      
      toast({
        title: "Thành công",
        description: "Thêm lớp học mới thành công",
      });
      setShowAddForm(false);
      await fetchClasses();
    } catch (error: any) {
      console.error("Error adding class:", error);
      
      await reinitializePolicies();
      
      let errorMsg = "Không thể thêm lớp học mới";
      if (error && error.message) {
        errorMsg += `: ${error.message}`;
      }
      
      if (error && error.code === 'PGRST204') {
        setErrorMessage("Có vấn đề với cấu trúc cơ sở dữ liệu. Bạn có muốn khởi tạo lại cấu trúc cơ sở dữ liệu không?");
        setShowErrorDialog(true);
      } else {
        toast({
          title: "Lỗi",
          description: errorMsg,
          variant: "destructive"
        });
      }
    }
  };

  const handleInitializeDatabase = async () => {
    try {
      await initializeDatabase();
      setShowErrorDialog(false);
      toast({
        title: "Thành công",
        description: "Đã khởi tạo lại cơ sở dữ liệu. Vui lòng thử lại.",
      });
      await fetchClasses();
    } catch (error) {
      console.error("Error initializing database:", error);
      toast({
        title: "Lỗi",
        description: "Không thể khởi tạo lại cơ sở dữ liệu",
        variant: "destructive"
      });
    }
  };

  // Fix: Convert field and value to the format expected by handleFilterChange
  const adaptFilterChange = (field: string, value: string) => {
    if (field === 'facilityId') {
      handleFilterChange({ facility: value === 'none' ? '' : value });
    } else if (field === 'status') {
      handleFilterChange({ program: value === 'none' ? '' : value });
    } else {
      // Handle other filter fields if needed
      console.log(`Unhandled filter field: ${field}`);
    }
  };

  return (
    <>
      {(classes.length === 0 && !isLoading) ? (
        <PlaceholderPage
          title="Lớp Học"
          description="Quản lý thông tin lớp học"
          addButtonAction={handleAddClick}
        />
      ) : (
        <TablePageLayout
          title="Lớp Học"
          description="Quản lý thông tin lớp học"
          actions={
            <ClassActionsToolbar
              onAddClick={handleAddClick}
              onRefresh={fetchClasses}
              onFilterChange={adaptFilterChange}
              onResetFilters={handleResetFilters}
            />
          }
        >
          <ClassesTable
            classes={filteredClasses}
            isLoading={isLoading}
            onRowClick={handleRowClick}
          />
        </TablePageLayout>
      )}

      <ClassDetailPanel
        classItem={selectedClass}
        isOpen={showDetail}
        onClose={closeDetail}
      />

      <AddClassDialog
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSubmit={handleAddFormSubmit}
        onCancel={handleAddFormCancel}
      />

      <ClassErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errorMessage={errorMessage}
        onInitializeDatabase={handleInitializeDatabase}
      />
    </>
  );
};

export default Classes;
