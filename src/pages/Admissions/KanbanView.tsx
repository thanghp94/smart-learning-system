
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import AdmissionCard from './components/AdmissionCard';
import AdmissionForm from './components/AdmissionForm';
import { admissionService } from '@/lib/supabase/admission-service';
import { Admission, AdmissionStatus, ADMISSION_STATUS_MAP } from '@/lib/types/admission';
import { employeeService } from '@/lib/supabase';

const KanbanView = () => {
  const {
    toast
  } = useToast();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch admissions data
  useEffect(() => {
    const fetchAdmissions = async () => {
      setIsLoading(true);
      try {
        const data = await admissionService.getAll();
        setAdmissions(data);
      } catch (error) {
        console.error('Error fetching admissions:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu tuyển sinh',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmissions();
  }, [refreshTrigger, toast]);

  // Fetch employees for the person in charge dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAll();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Filter admissions by search query
  const filteredAdmissions = admissions.filter(admission => admission.ten_hoc_sinh.toLowerCase().includes(searchQuery.toLowerCase()) || admission.ten_phu_huynh && admission.ten_phu_huynh.toLowerCase().includes(searchQuery.toLowerCase()) || admission.so_dien_thoai && admission.so_dien_thoai.includes(searchQuery) || admission.so_dien_thoai_phu_huynh && admission.so_dien_thoai_phu_huynh.includes(searchQuery));

  // Group admissions by status
  const admissionsByStatus: Record<AdmissionStatus, Admission[]> = {
    tim_hieu: filteredAdmissions.filter(a => a.trang_thai === 'tim_hieu'),
    tu_van: filteredAdmissions.filter(a => a.trang_thai === 'tu_van'),
    hoc_thu: filteredAdmissions.filter(a => a.trang_thai === 'hoc_thu'),
    chot: filteredAdmissions.filter(a => a.trang_thai === 'chot'),
    huy: filteredAdmissions.filter(a => a.trang_thai === 'huy')
  };
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
  const handleFormSubmit = (admission: Admission) => {
    // Update local state
    if (selectedAdmission) {
      setAdmissions(prev => prev.map(a => a.id === admission.id ? admission : a));
    } else {
      setAdmissions(prev => [admission, ...prev]);
    }
    handleCloseForm();

    // Refresh data
    setRefreshTrigger(prev => prev + 1);
  };
  const handleDragStart = (e: React.DragEvent, admission: Admission) => {
    e.dataTransfer.setData('admissionId', admission.id);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = async (e: React.DragEvent, status: AdmissionStatus) => {
    e.preventDefault();
    const admissionId = e.dataTransfer.getData('admissionId');

    // Find the admission that was dragged
    const admission = admissions.find(a => a.id === admissionId);
    if (!admission || admission.trang_thai === status) return;

    // Update status in UI first for responsive feel
    setAdmissions(prev => prev.map(a => a.id === admissionId ? {
      ...a,
      trang_thai: status
    } : a));

    // Then update in database
    try {
      await admissionService.updateAdmissionStatus(admissionId, status);
      toast({
        title: 'Cập nhật trạng thái',
        description: `${admission.ten_hoc_sinh} đã được chuyển sang ${ADMISSION_STATUS_MAP[status]}`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      // Rollback UI change
      setAdmissions(prev => prev.map(a => a.id === admissionId ? {
        ...a,
        trang_thai: admission.trang_thai
      } : a));
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái',
        variant: 'destructive'
      });
    }
  };
  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Get employee name from ID
  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return '';
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.ten_nhan_su : '';
  };

  // Render the KanbanBoard
  const renderKanbanBoard = () => {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 p-2">
        {Object.entries(ADMISSION_STATUS_MAP).map(([status, label]) => <div key={status} className="bg-gray-50 rounded-lg p-2 flex flex-col" style={{
        maxHeight: 'calc(100vh - 13rem)',
        height: 'calc(100vh - 13rem)'
      }} onDragOver={handleDragOver} onDrop={e => handleDrop(e, status as AdmissionStatus)}>
            <div className="flex justify-between items-center mb-2 sticky top-0 bg-gray-50 p-1 z-10 border-b">
              <h3 className="font-medium text-gray-800">{label}</h3>
              <span className="text-sm font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                {admissionsByStatus[status as AdmissionStatus]?.length || 0}
              </span>
            </div>
            <div className="overflow-y-auto flex-grow space-y-1.5 pr-1">
              {admissionsByStatus[status as AdmissionStatus]?.map(admission => <AdmissionCard key={admission.id} admission={admission} onClick={handleOpenDetail} onDragStart={handleDragStart} />)}
              {admissionsByStatus[status as AdmissionStatus]?.length === 0 && <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">Không có học sinh nào</p>
                </div>}
            </div>
          </div>)}
      </div>;
  };
  return <div className="container mx-auto pb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm học sinh..." className="pl-8" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
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

      {isLoading ? <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div> : <Tabs defaultValue="kanban">
          
          <TabsContent value="kanban" className="p-0">
            {renderKanbanBoard()}
          </TabsContent>
        </Tabs>}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAdmission ? 'Cập nhật thông tin học sinh' : 'Thêm học sinh mới'}
            </DialogTitle>
          </DialogHeader>
          <AdmissionForm initialData={selectedAdmission || undefined} onSubmit={handleFormSubmit} onCancel={handleCloseForm} />
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
          {selectedAdmission && <div className="space-y-6">
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
                    <p className="font-medium">{ADMISSION_STATUS_MAP[selectedAdmission.trang_thai]}</p>
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
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
};
export default KanbanView;
