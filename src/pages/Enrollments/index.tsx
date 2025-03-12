
import React, { useState } from "react";
import { Enrollment } from "@/lib/types";
import TablePageLayout from "@/components/common/TablePageLayout";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import EnrollmentTable from "./components/EnrollmentTable";
import EnrollmentDetailPanel from "./components/EnrollmentDetailPanel";
import EnrollmentSheets from "./components/EnrollmentSheets";
import EnrollmentActionHeader from "./components/EnrollmentActionHeader";
import { useEnrollmentData } from "./hooks/useEnrollmentData";
import { useEnrollmentForm } from "./hooks/useEnrollmentForm";

const Enrollments = () => {
  const { 
    filteredEnrollments, 
    isLoading, 
    students, 
    classes, 
    filters,
    fetchData, 
    handleFilterChange, 
    handleResetFilters 
  } = useEnrollmentData();
  
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  
  const closeAddSheet = () => setIsAddSheetOpen(false);
  const closeEditSheet = () => {
    setIsEditSheetOpen(false);
    setSelectedEnrollment(null);
  };

  const { 
    isSubmitting, 
    setIsSubmitting, 
    handleAddEnrollment, 
    handleUpdateEnrollment 
  } = useEnrollmentForm(fetchData, closeAddSheet, closeEditSheet);

  const openAddSheet = () => {
    setIsAddSheetOpen(true);
  };
  
  const openEditSheet = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsEditSheetOpen(true);
  };
  
  const openDetailPanel = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsDetailPanelOpen(true);
  };
  
  const closeDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedEnrollment(null);
  };

  const handleEditFromDetail = () => {
    closeDetailPanel();
    if (selectedEnrollment) {
      openEditSheet(selectedEnrollment);
    }
  };

  // Handler for updating enrollment
  const onUpdateSubmit = (data: Partial<Enrollment>) => {
    handleUpdateEnrollment(selectedEnrollment, data);
  };

  // Render placeholder if no data and not loading
  if (filteredEnrollments.length === 0 && !isLoading) {
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
      actions={
        <EnrollmentActionHeader
          onFilterChange={handleFilterChange}
          filters={filters}
          onReset={handleResetFilters}
          onRefresh={fetchData}
          onAdd={openAddSheet}
        />
      }
    >
      <EnrollmentTable 
        enrollments={filteredEnrollments}
        isLoading={isLoading}
        onRowClick={openDetailPanel}
        onEditClick={openEditSheet}
      />

      <EnrollmentSheets 
        isAddSheetOpen={isAddSheetOpen}
        setIsAddSheetOpen={setIsAddSheetOpen}
        isEditSheetOpen={isEditSheetOpen}
        setIsEditSheetOpen={setIsEditSheetOpen}
        selectedEnrollment={selectedEnrollment}
        students={students}
        classes={classes}
        isSubmitting={isSubmitting}
        onAddSubmit={handleAddEnrollment}
        onUpdateSubmit={onUpdateSubmit}
      />
      
      <EnrollmentDetailPanel 
        enrollment={selectedEnrollment}
        isOpen={isDetailPanelOpen}
        onClose={closeDetailPanel}
        onEditClick={handleEditFromDetail}
      />
    </TablePageLayout>
  );
};

export default Enrollments;
