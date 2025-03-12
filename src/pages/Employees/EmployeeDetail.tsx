
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Employee } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { employeeService, facilityService } from '@/lib/supabase';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import EmployeeHeader from './components/EmployeeHeader';
import EmployeeBasicInfoTab from './components/EmployeeBasicInfoTab';
import EmployeeContractTab from './components/EmployeeContractTab';
import EmployeeFinancesTab from './components/EmployeeFinancesTab';
import EmployeeFilesTab from './components/EmployeeFilesTab';
import { Button } from '@/components/ui/button';

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [tempEmployeeData, setTempEmployeeData] = useState<Employee | null>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const employeeData = await employeeService.getById(id);
          setEmployee(employeeData);
          setTempEmployeeData({...employeeData});
        }
        
        const facilitiesData = await facilityService.getAll();
        setFacilities(facilitiesData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin nhân viên",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, toast]);

  const handleBack = () => {
    navigate('/employees');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit mode
      setTempEmployeeData({...employee});
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempEmployeeData(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleMultiSelectChange = (name: string, value: string[]) => {
    setTempEmployeeData(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleDateChange = (name: string, value: Date | null) => {
    setTempEmployeeData(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleImageUpload = (url: string) => {
    setTempEmployeeData(prev => {
      if (!prev) return prev;
      return { ...prev, hinh_anh: url };
    });
  };

  const handleSave = async () => {
    if (!tempEmployeeData || !employee || !id) return;
    
    try {
      setIsLoading(true);
      
      // Process the data for API submission
      const dataToSubmit = { ...tempEmployeeData };
      
      // Handle date conversion if needed
      if (dataToSubmit.ngay_sinh instanceof Date) {
        dataToSubmit.ngay_sinh = dataToSubmit.ngay_sinh.toISOString();
      }
      
      await employeeService.update(id, dataToSubmit);
      
      setEmployee(dataToSubmit);
      setIsEditing(false);
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin nhân viên"
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin nhân viên",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  }

  if (!employee) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Không tìm thấy thông tin nhân viên</p>
        <Button onClick={handleBack}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <EmployeeHeader 
        employeeName={employee.ten_nhan_su}
        isEditing={isEditing}
        handleBack={handleBack}
        handleEditToggle={handleEditToggle}
        handleSave={handleSave}
      />

      <Separator className="mb-6" />

      <Tabs defaultValue="basic">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="contracts">Hợp đồng</TabsTrigger>
          <TabsTrigger value="finances">Tài chính</TabsTrigger>
          <TabsTrigger value="files">Tài liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <EmployeeBasicInfoTab 
            employee={employee}
            tempEmployeeData={tempEmployeeData}
            facilities={facilities}
            isEditing={isEditing}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            handleDateChange={handleDateChange}
            handleMultiSelectChange={handleMultiSelectChange}
          />
        </TabsContent>

        <TabsContent value="contracts">
          {id && <EmployeeContractTab employeeId={id} />}
        </TabsContent>

        <TabsContent value="finances">
          {id && <EmployeeFinancesTab employeeId={id} />}
        </TabsContent>

        <TabsContent value="files">
          {id && <EmployeeFilesTab employeeId={id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetail;
