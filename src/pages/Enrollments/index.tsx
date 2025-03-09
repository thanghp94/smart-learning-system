
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import EnrollmentForm from "./EnrollmentForm";

const Enrollments = () => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  
  const openAddSheet = () => {
    setIsAddSheetOpen(true);
  };

  const closeAddSheet = () => {
    setIsAddSheetOpen(false);
  };

  const handleAddEnrollment = (data: any) => {
    console.log("Adding enrollment:", data);
    // Here you would call the service to add the enrollment
    // enrollmentService.create(data).then(() => {
    //   // Handle success, refresh data, etc.
    // });
    closeAddSheet();
  };

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button size="sm" className="h-8" onClick={openAddSheet}>
        <Plus className="h-4 w-4 mr-1" /> Thêm mới
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Ghi Danh"
      description="Quản lý danh sách ghi danh học sinh vào lớp học"
      actions={tableActions}
    >
      <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-md bg-card/50">
        <h3 className="mt-4 text-xl font-medium text-muted-foreground">Ghi Danh</h3>
        <p className="mt-2 text-sm text-muted-foreground/70">Quản lý danh sách ghi danh học sinh vào lớp học</p>
        <Button className="mt-6" size="sm" onClick={openAddSheet}>
          <Plus className="h-4 w-4 mr-1" /> Thêm mới ghi danh
        </Button>
      </div>

      {/* Add Enrollment Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Thêm Ghi Danh Mới</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <EnrollmentForm onSubmit={handleAddEnrollment} />
          </div>
        </SheetContent>
      </Sheet>
    </TablePageLayout>
  );
};

export default Enrollments;
