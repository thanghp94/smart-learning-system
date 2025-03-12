import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { employeeService } from '@/lib/supabase';
import { Employee } from '@/lib/types';
import EmployeeBasicInfo from './components/EmployeeBasicInfo';
import EmployeeFilesTab from './components/EmployeeFilesTab';
import EmployeeSalaryTab from './components/EmployeeSalaryTab';
import EmployeeContractsTab from './components/EmployeeContractsTab';

interface EmployeeDetailProps {
  // Making employeeId optional since we'll get it from useParams if not provided
  employeeId?: string;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employeeId: propEmployeeId }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const employeeId = propEmployeeId || paramId;
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true);
      try {
        if (!employeeId) {
          toast({
            title: 'Error',
            description: 'Employee ID not provided',
            variant: 'destructive',
          });
          navigate('/employees');
          return;
        }
        
        const data = await employeeService.getById(employeeId);
        if (!data) {
          toast({
            title: 'Error',
            description: 'Employee not found',
            variant: 'destructive',
          });
          navigate('/employees');
          return;
        }
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch employee data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployee();
  }, [employeeId, navigate, toast]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto py-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="large" />
        </div>
      ) : employee ? (
        <>
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{employee.ten_nhan_su}</h1>
              <Button onClick={() => navigate('/employees/edit/' + employee.id)}>Edit</Button>
            </div>
            <p className="text-muted-foreground">{employee.chuc_danh} ({employee.bo_phan})</p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="files">Hồ sơ</TabsTrigger>
              <TabsTrigger value="salary">Lương</TabsTrigger>
              <TabsTrigger value="contracts">Hợp đồng</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <EmployeeBasicInfo employee={employee} />
            </TabsContent>
            <TabsContent value="files">
              <EmployeeFilesTab employeeId={employee.id} />
            </TabsContent>
            <TabsContent value="salary">
              <EmployeeSalaryTab employeeId={employee.id} />
            </TabsContent>
             <TabsContent value="contracts">
              <EmployeeContractsTab employeeId={employee.id} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl text-muted-foreground">Employee not found</p>
          <Button className="mt-4" onClick={() => navigate('/employees')}>
            Back to Employees
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
