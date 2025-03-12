
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, RefreshCw } from 'lucide-react';
import AdmissionForm from './components/AdmissionForm';
import { AdmissionStatus, ADMISSION_STATUS_MAP, Admission } from '@/lib/types/admission';
import KanbanColumn from './components/KanbanColumn';
import AdmissionFilters from './components/AdmissionFilters';
import { useAdmissionData } from './hooks/useAdmissionData';

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

  // Render the KanbanBoard
  const renderKanbanBoard = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 p-2">
        {Object.entries(ADMISSION_STATUS_MAP).map(([status, label]) => (
          <KanbanColumn 
            key={status}
            status={status as AdmissionStatus}
            label={label}
            admissions={getAdmissionsByStatus(status as AdmissionStatus)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onCardClick={handleOpenDetail}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto pb-4">
      <div className="flex justify-between items-center mb-4">
        <AdmissionFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          facilityFilter={facilityFilter}
          setFacilityFilter={setFacilityFilter}
          facilities={facilities}
          handleResetFilters={handleResetFilters}
        />
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tải lại
          </Button>
          <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <Tabs defaultValue="kanban">
          <TabsContent value="kanban" className="p-0">
            {renderKanbanBoard()}
          </TabsContent>
        </Tabs>
      )}

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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Thông tin học sinh</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Tên học sinh</p>
                      <p className="font-medium">{selectedAdmission.ten_hoc_sinh}</p>
                    </div>
                    {selectedAdmission.ngay_sinh && <div>
                        <p className="text-sm text-muted-foreground">Ngày sinh</p>
                        <p>{new Date(selectedAdmission.ngay_sinh).toLocaleDateString('vi-VN')}</p>
                      </div>}
                    {selectedAdmission.gioi_tinh && <div>
                        <p className="text-sm text-muted-foreground">Giới tính</p>
                        <p>{selectedAdmission.gioi_tinh}</p>
                      </div>}
                    {selectedAdmission.email && <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{selectedAdmission.email}</p>
                      </div>}
                    {selectedAdmission.so_dien_thoai && <div>
                        <p className="text-sm text-muted-foreground">Số điện thoại</p>
                        <p>{selectedAdmission.so_dien_thoai}</p>
                      </div>}
                    {selectedAdmission.zalo && <div>
                        <p className="text-sm text-muted-foreground">Zalo</p>
                        <p>{selectedAdmission.zalo}</p>
                      </div>}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Thông tin phụ huynh</h3>
                  <div className="space-y-2">
                    {selectedAdmission.ten_phu_huynh && <div>
                        <p className="text-sm text-muted-foreground">Tên phụ huynh</p>
                        <p className="font-medium">{selectedAdmission.ten_phu_huynh}</p>
                      </div>}
                    {selectedAdmission.email_phu_huynh && <div>
                        <p className="text-sm text-muted-foreground">Email phụ huynh</p>
                        <p>{selectedAdmission.email_phu_huynh}</p>
                      </div>}
                    {selectedAdmission.so_dien_thoai_phu_huynh && <div>
                        <p className="text-sm text-muted-foreground">Số điện thoại phụ huynh</p>
                        <p>{selectedAdmission.so_dien_thoai_phu_huynh}</p>
                      </div>}
                    {selectedAdmission.dia_chi && <div>
                        <p className="text-sm text-muted-foreground">Địa chỉ</p>
                        <p>{selectedAdmission.dia_chi}</p>
                      </div>}
                    {selectedAdmission.nguon_gioi_thieu && <div>
                        <p className="text-sm text-muted-foreground">Nguồn giới thiệu</p>
                        <p>{selectedAdmission.nguon_gioi_thieu}</p>
                      </div>}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">Thông tin bổ sung</h3>

                {selectedAdmission.mieu_ta_hoc_sinh && <div>
                    <p className="text-sm text-muted-foreground">Miêu tả về học sinh</p>
                    <p className="whitespace-pre-wrap">{selectedAdmission.mieu_ta_hoc_sinh}</p>
                  </div>}

                {selectedAdmission.ghi_chu && <div>
                    <p className="text-sm text-muted-foreground">Ghi chú khác</p>
                    <p className="whitespace-pre-wrap">{selectedAdmission.ghi_chu}</p>
                  </div>}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <p className="font-medium">{ADMISSION_STATUS_MAP[selectedAdmission.trang_thai as AdmissionStatus]}</p>
                  </div>

                  {selectedAdmission.nguoi_phu_trach && <div>
                      <p className="text-sm text-muted-foreground">Người phụ trách</p>
                      <p>{getEmployeeName(selectedAdmission.nguoi_phu_trach)}</p>
                    </div>}

                  {selectedAdmission.ngay_lien_he_dau && <div>
                      <p className="text-sm text-muted-foreground">Ngày liên hệ đầu</p>
                      <p>{new Date(selectedAdmission.ngay_lien_he_dau).toLocaleDateString('vi-VN')}</p>
                    </div>}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleCloseDetail}>
                  Đóng
                </Button>
                <Button onClick={() => {
                  handleCloseDetail();
                  handleOpenForm(selectedAdmission);
                }}>
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanView;
