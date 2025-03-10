
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Finance, Student, Employee, Contact, Facility } from "@/lib/types";
import { financeService, studentService, employeeService, contactService, facilityService } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, Filter, RotateCw } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "@/components/ui/DataTable";
import { useToast } from "@/hooks/use-toast";
import FinanceForm from "./FinanceForm";
import EntityFinancesView from "./components/EntityFinancesView";
import { formatCurrency } from "@/utils/format";

const FinancePage = () => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch finances
      const financesData = await financeService.getAll();
      setFinances(financesData);
      
      // Fetch students
      const studentsData = await studentService.getAll();
      setStudents(studentsData);
      
      // Fetch employees
      const employeesData = await employeeService.getAll();
      setEmployees(employeesData);
      
      // Fetch contacts
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
      
      // Fetch facilities
      const facilitiesData = await facilityService.getAll();
      setFacilities(facilitiesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu tài chính",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFinance = async (formData: Partial<Finance>) => {
    try {
      setIsSubmitting(true);
      await financeService.create(formData);
      
      toast({
        title: "Thành công",
        description: "Đã thêm giao dịch tài chính mới",
      });
      
      fetchData();
      setIsAddSheetOpen(false);
    } catch (error) {
      console.error("Error adding finance:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm giao dịch tài chính mới",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFinanceType = (type?: string) => {
    if (!type) return <Badge variant="outline">Không xác định</Badge>;
    
    return type.toLowerCase() === 'thu' ? (
      <Badge variant="success">Thu</Badge>
    ) : (
      <Badge variant="destructive">Chi</Badge>
    );
  };

  const getFinanceStatus = (status?: string) => {
    if (!status) return <Badge variant="outline">Pending</Badge>;
    
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="success">Hoàn thành</Badge>;
      case 'pending':
        return <Badge variant="warning">Chờ xử lý</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      title: "Ngày",
      key: "ngay",
      sortable: true,
      render: (value: string) => <span>{value || "-"}</span>
    },
    {
      title: "Loại",
      key: "loai_thu_chi",
      sortable: true,
      render: (value: string) => getFinanceType(value)
    },
    {
      title: "Đối tượng",
      key: "loai_doi_tuong",
      sortable: true,
      render: (value: string) => <span>{value || "-"}</span>
    },
    {
      title: "Diễn giải",
      key: "dien_giai",
      render: (value: string) => <span>{value || "-"}</span>
    },
    {
      title: "Số tiền",
      key: "tong_tien",
      sortable: true,
      render: (value: number) => <span>{formatCurrency(value)}</span>
    },
    {
      title: "Trạng thái",
      key: "tinh_trang",
      sortable: true,
      render: (value: string) => getFinanceStatus(value)
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quản lý tài chính</h1>
          <p className="text-muted-foreground">Theo dõi các giao dịch tài chính trong hệ thống</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RotateCw className="h-4 w-4 mr-1" /> Làm mới
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> Lọc
          </Button>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-1" /> Xuất
          </Button>
          <Button size="sm" onClick={() => setIsAddSheetOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Thêm giao dịch
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tất cả giao dịch</TabsTrigger>
          <TabsTrigger value="student">Học sinh</TabsTrigger>
          <TabsTrigger value="employee">Nhân viên</TabsTrigger>
          <TabsTrigger value="contact">Liên hệ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <DataTable
            columns={columns}
            data={finances}
            isLoading={isLoading}
            searchable={true}
            searchPlaceholder="Tìm kiếm giao dịch..."
            onRowClick={(finance) => navigate(`/finance/${finance.id}`)}
          />
        </TabsContent>
        
        <TabsContent value="student" className="pt-4">
          <EntityFinancesView entityType="student" />
        </TabsContent>
        
        <TabsContent value="employee" className="pt-4">
          <EntityFinancesView entityType="employee" />
        </TabsContent>
        
        <TabsContent value="contact" className="pt-4">
          <EntityFinancesView entityType="contact" />
        </TabsContent>
      </Tabs>

      {/* Add Finance Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Thêm giao dịch tài chính</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <FinanceForm
              onSubmit={handleAddFinance}
              onCancel={() => setIsAddSheetOpen(false)}
              facilities={facilities}
              students={students}
              employees={employees}
              contacts={contacts}
              isLoading={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FinancePage;
