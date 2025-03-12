
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdmissionForm from './components/AdmissionForm';
import { Admission } from '@/lib/types/admission';
import { useAdmissionData } from './hooks/useAdmissionData';
import KanbanHeader from './components/AdmissionForm/KanbanHeader';
import KanbanBoard from './components/KanbanBoard';
import AdmissionDetailView from './components/AdmissionForm/AdmissionDetailView';

const KanbanView = () => {
  const { 
    filteredAdmissions,
    facilities,
    facilityFilter,
    isLoading,
    searchQuery,
    getAdmissionsByStatus,
    handleDragStart,
    handleDragOver,
    handleDrop,
    getEmployeeName,
    refresh,
    handleResetFilters,
    setFacilityFilter,
    setSearchQuery
  } = useAdmissionData();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  
  const handleOpenForm = (admission?: Admission) => {
    setSelectedAdmission(admission || null);
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };
  
  const handleOpenDetail = (admission: Admission) => {
    setSelectedAdmission(admission);
    setIsDetailOpen(true);
    setIsFormOpen(false);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedAdmission(null);
  };
  
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedAdmission(null);
  };
  
  const handleFormSubmit = () => {
    handleCloseForm();
    refresh();
  };

  return (
    <div className="container mx-auto pb-4">
      <KanbanHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        facilityFilter={facilityFilter}
        setFacilityFilter={setFacilityFilter}
        facilities={facilities}
        handleResetFilters={handleResetFilters}
        refresh={refresh}
        handleOpenForm={() => handleOpenForm()}
      />

      <KanbanBoard 
        getAdmissionsByStatus={getAdmissionsByStatus}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragStart={handleDragStart}
        onCardClick={handleOpenDetail}
        isLoading={isLoading}
      />

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAdmission ? 'Cập nhật thông tin học sinh' : 'Thêm học sinh mới'}
            </DialogTitle>
          </DialogHeader>
          <AdmissionForm 
            initialData={selectedAdmission || undefined} 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseForm} 
          />
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Thông tin chi tiết học sinh
            </DialogTitle>
          </DialogHeader>
          {selectedAdmission && (
            <AdmissionDetailView 
              admission={selectedAdmission}
              getEmployeeName={getEmployeeName}
              onClose={handleCloseDetail}
              onEdit={() => {
                handleCloseDetail();
                handleOpenForm(selectedAdmission);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanView;
