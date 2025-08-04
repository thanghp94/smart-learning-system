import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { CalendarIcon, CreditCard, User2Icon, GraduationCap, Briefcase, FileText, MessageSquare, CheckCircle2, LucideIcon } from "lucide-react"
import { useToast } from '@/hooks/use-toast';
import { employeeService } from "@/lib/database";

interface DashboardNavItemProps {
  title: string;
  icon: LucideIcon;
  content: React.ReactNode;
}

const DashboardNavItem: React.FC<DashboardNavItemProps> = ({ title, icon: Icon, content }) => {
  return (
    <TabsContent value={title.toLowerCase().replace(/\s+/g, '-')} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 mr-2" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {content}
    </TabsContent>
  );
};

const EmployeeDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        const employeeData = await employeeService.getById(id);
        setEmployee(employeeData);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu nhân viên',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  return (
    <div className="container mx-auto py-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        employee && (
          <>
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold">{employee.ten_nhan_su}</h1>
                  <p className="text-muted-foreground">{employee.chuc_danh} ({employee.bo_phan})</p>
                </div>
                
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Ngày sinh:</span>
                    <span>{employee.ngay_sinh ? format(new Date(employee.ngay_sinh), 'dd/MM/yyyy') : 'N/A'}</span>
                    
                    <span className="font-medium">Điện thoại:</span>
                    <span>{employee.dien_thoai || 'N/A'}</span>
                    
                    <span className="font-medium">Email:</span>
                    <span>{employee.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
            </div>
          </>
        )
      )}
    </div>
  );
};

export default EmployeeDashboard;
