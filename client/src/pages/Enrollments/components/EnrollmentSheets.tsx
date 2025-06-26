
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import EnrollmentForm from "../EnrollmentForm";
import { Enrollment, Student, Class } from "@/lib/types";

interface EnrollmentSheetsProps {
  isAddSheetOpen: boolean;
  setIsAddSheetOpen: (open: boolean) => void;
  isEditSheetOpen: boolean;
  setIsEditSheetOpen: (open: boolean) => void;
  selectedEnrollment: Enrollment | null;
  students: Student[];
  classes: Class[];
  isSubmitting: boolean;
  onAddSubmit: (data: Partial<Enrollment>) => void;
  onUpdateSubmit: (data: Partial<Enrollment>) => void;
}

const EnrollmentSheets: React.FC<EnrollmentSheetsProps> = ({
  isAddSheetOpen,
  setIsAddSheetOpen,
  isEditSheetOpen,
  setIsEditSheetOpen,
  selectedEnrollment,
  students,
  classes,
  isSubmitting,
  onAddSubmit,
  onUpdateSubmit,
}) => {
  return (
    <>
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Thêm Ghi Danh Mới</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <EnrollmentForm 
              onSubmit={onAddSubmit} 
              students={students}
              classes={classes}
              isLoading={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Sửa Thông Tin Ghi Danh</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {selectedEnrollment && (
              <EnrollmentForm 
                initialData={selectedEnrollment}
                onSubmit={onUpdateSubmit} 
                students={students}
                classes={classes}
                isLoading={isSubmitting}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EnrollmentSheets;
