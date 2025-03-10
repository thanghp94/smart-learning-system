import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import { financeService } from "@/lib/supabase";
import { Finance } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import FinanceForm from "./FinanceForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { studentService, employeeService, contactService } from "@/lib/supabase";
import { Student, Employee, Contact } from "@/lib/types";
import EntityFinancesView from "./components/EntityFinancesView";

const Finance = () => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDateRange, setFilterDateRange] = useState<{ from: Date | null, to: Date | null }>({ from: null, to: null });
  const [students, setStudents] = useState<Student[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Alert users that this is a prototype feature
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    fetchFinances();
    fetchStudents();
    fetchEmployees();
    fetchContacts();
  }, []);

  const fetchFinances = async () => {
    try {
      setIsLoading(true);
      let data = await financeService.getAll();

      // Apply filters
      if (filterType) {
        data = await financeService.getByType(filterType);
      }
      if (filterStatus) {
        data = await financeService.getByStatus(filterStatus);
      }
      if (filterDateRange.from && filterDateRange.to) {
        const fromDate = filterDateRange.from.toISOString().split('T')[0];
        const toDate = filterDateRange.to.toISOString().split('T')[0];
        data = await financeService.getByDateRange(fromDate, toDate);
      }

      setFinances(data);
      calculateTotals(data);
    } catch (error) {
      console.error("Error fetching finances:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tài chính",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const calculateTotals = (data: Finance[]) => {
    let income = 0;
    let expense = 0;
    data.forEach(finance => {
      if (finance.loai_thu_chi === 'income') {
        income += finance.so_tien || 0;
      } else {
        expense += finance.so_tien || 0;
      }
    });
    setTotalIncome(income);
    setTotalExpense(expense);
  };

  const handleRowClick = (finance: Finance) => {
    setSelectedFinance(finance);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<Finance>) => {
    try {
      const newFinance = await financeService.create(formData);
      setFinances([...finances, newFinance]);
      toast({
        title: "Thành công",
        description: "Thêm mục tài chính mới thành công",
      });
      setShowAddForm(false);
      fetchFinances();
    } catch (error) {
      console.error("Error adding finance:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm mục tài chính mới",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Ngày",
      key: "ngay",
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Loại",
      key: "loai_thu_chi",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "income" ? "success" : "destructive"}>
          {value === "income" ? "Thu" : "Chi"}
        </Badge>
      ),
    },
    {
      title: "Số Tiền",
      key: "so_tien",
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Đối Tượng",
      key: "doi_tuong",
      sortable: true,
    },
    {
      title: "Mô Tả",
      key: "mo_ta",
    },
    {
      title: "Tình Trạng",
      key: "tinh_trang",
      sortable: true,
      render: (value: string) => (
        <Badge variant="secondary">{value}</Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchFinances}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Mục
      </Button>
    </div>
  );

  return (
    <>
      {showAlert && (
        <Alert className="mb-6" variant="default">
          <AlertTitle>Tính năng đang phát triển</AlertTitle>
          <AlertDescription>
            Chức năng quản lý tài chính đang trong giai đoạn phát triển. Một số tính năng có thể chưa hoạt động đầy đủ.
            <Button variant="link" className="p-0 h-auto ml-2" onClick={() => setShowAlert(false)}>
              Đóng thông báo
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <TablePageLayout
        title="Quản Lý Tài Chính"
        description="Quản lý thu chi và các hoạt động tài chính"
        actions={tableActions}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><ArrowDown className="mr-2 text-green-500" /> Tổng Thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><ArrowUp className="mr-2 text-red-500" /> Tổng Chi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center"><Clock className="mr-2" /> Thống Kê</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Biểu đồ thống kê thu chi (sẽ được thêm vào)
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="students">Học sinh</TabsTrigger>
            <TabsTrigger value="employees">Nhân viên</TabsTrigger>
            <TabsTrigger value="contacts">Liên hệ</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <DataTable
              columns={columns}
              data={finances}
              isLoading={isLoading}
              onRowClick={handleRowClick}
              searchable={true}
              searchPlaceholder="Tìm kiếm giao dịch..."
            />
          </TabsContent>
          <TabsContent value="students" className="space-y-4">
            <EntityFinancesView entityType="student" entities={students} />
          </TabsContent>
          <TabsContent value="employees" className="space-y-4">
            <EntityFinancesView entityType="employee" entities={employees} />
          </TabsContent>
          <TabsContent value="contacts" className="space-y-4">
            <EntityFinancesView entityType="contact" entities={contacts} />
          </TabsContent>
        </Tabs>
      </TablePageLayout>

      {selectedFinance && (
        <DetailPanel
          title="Thông Tin Chi Tiết"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <div>
            <p>Ngày: {formatDate(selectedFinance.ngay)}</p>
            <p>Loại: {selectedFinance.loai_thu_chi}</p>
            <p>Số Tiền: {formatCurrency(selectedFinance.so_tien)}</p>
            <p>Đối Tượng: {selectedFinance.doi_tuong}</p>
            <p>Mô Tả: {selectedFinance.mo_ta}</p>
            <p>Tình Trạng: {selectedFinance.tinh_trang}</p>
          </div>
        </DetailPanel>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Mục Tài Chính Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết vào mẫu dưới đây
            </DialogDescription>
          </DialogHeader>
          <FinanceForm
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Finance;
