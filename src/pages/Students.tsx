
import React, { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/ui/DataTable";
import DetailPanel from "@/components/ui/DetailPanel";
import { GENDERS, STATUS_COLORS } from "@/lib/constants";
import { Student } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, Phone, MapPin, School, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for students
const mockStudents: Student[] = [
  {
    id: "1",
    ten_hoc_sinh: "Nguyễn Văn An",
    gioi_tinh: "male",
    ngay_sinh: "2008-05-12",
    co_so_ID: "CS001",
    ten_PH: "Nguyễn Văn Bình",
    sdt_ph1: "0912345678",
    email_ph1: "binh.nguyen@example.com",
    dia_chi: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    ct_hoc: "Toán nâng cao",
    trang_thai: "active",
    han_hoc_phi: "2023-12-31"
  },
  {
    id: "2",
    ten_hoc_sinh: "Trần Thị Bình",
    gioi_tinh: "female",
    ngay_sinh: "2009-03-18",
    co_so_ID: "CS002",
    ten_PH: "Trần Văn Cường",
    sdt_ph1: "0923456789",
    email_ph1: "cuong.tran@example.com",
    dia_chi: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    ct_hoc: "Tiếng Anh cơ bản",
    trang_thai: "active",
    han_hoc_phi: "2023-11-30"
  },
  {
    id: "3",
    ten_hoc_sinh: "Lê Minh Châu",
    gioi_tinh: "female",
    ngay_sinh: "2007-07-22",
    co_so_ID: "CS001",
    ten_PH: "Lê Văn Dũng",
    sdt_ph1: "0934567890",
    email_ph1: "dung.le@example.com",
    dia_chi: "789 Đường Hai Bà Trưng, Quận 3, TP.HCM",
    ct_hoc: "Khoa học tự nhiên",
    trang_thai: "inactive",
    han_hoc_phi: "2023-10-31"
  },
  {
    id: "4",
    ten_hoc_sinh: "Phạm Minh Dũng",
    gioi_tinh: "male",
    ngay_sinh: "2010-01-05",
    co_so_ID: "CS003",
    ten_PH: "Phạm Thị Em",
    sdt_ph1: "0945678901",
    email_ph1: "em.pham@example.com",
    dia_chi: "101 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM",
    ct_hoc: "Toán cơ bản",
    trang_thai: "pending",
    han_hoc_phi: "2023-11-15"
  },
  {
    id: "5",
    ten_hoc_sinh: "Hoàng Thị Gia",
    gioi_tinh: "female",
    ngay_sinh: "2008-09-30",
    co_so_ID: "CS002",
    ten_PH: "Hoàng Văn Hùng",
    sdt_ph1: "0956789012",
    email_ph1: "hung.hoang@example.com",
    dia_chi: "202 Đường Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM",
    ct_hoc: "Tiếng Anh nâng cao",
    trang_thai: "active",
    han_hoc_phi: "2023-12-15"
  },
  {
    id: "6",
    ten_hoc_sinh: "Đinh Văn Huy",
    gioi_tinh: "male",
    ngay_sinh: "2009-11-11",
    co_so_ID: "CS001",
    ten_PH: "Đinh Thị Hương",
    sdt_ph1: "0967890123",
    email_ph1: "huong.dinh@example.com",
    dia_chi: "303 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    ct_hoc: "Văn học",
    trang_thai: "active",
    han_hoc_phi: "2023-11-30"
  }
];

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setDetailOpen(true);
  };

  const columns = [
    {
      title: "Học sinh",
      key: "ten_hoc_sinh",
      render: (value: string, record: Student) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={record.hinh_anh_hoc_sinh} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {value.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">ID: {record.id}</div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      title: "Chương trình học",
      key: "ct_hoc",
      render: (value: string) => (
        <span className="font-medium">{value}</span>
      ),
      sortable: true
    },
    {
      title: "Phụ huynh",
      key: "ten_PH",
      render: (value: string, record: Student) => (
        <div>
          <div>{value}</div>
          <div className="text-xs text-muted-foreground">{record.sdt_ph1}</div>
        </div>
      ),
      sortable: true
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      render: (value: string) => (
        <Badge className={cn(STATUS_COLORS[value as keyof typeof STATUS_COLORS] || STATUS_COLORS.default)}>
          {value === "active" && "Đang học"}
          {value === "inactive" && "Nghỉ học"}
          {value === "pending" && "Chờ xác nhận"}
        </Badge>
      ),
      width: "120px",
      sortable: true
    },
    {
      title: "Hạn học phí",
      key: "han_hoc_phi",
      render: (value: string) => {
        const date = new Date(value);
        const now = new Date();
        const isExpired = date < now;
        
        return (
          <div className={cn(
            "text-sm font-medium",
            isExpired ? "text-red-500" : "text-green-500"
          )}>
            {new Date(value).toLocaleDateString("vi-VN")}
          </div>
        );
      },
      width: "120px",
      sortable: true
    }
  ];

  return (
    <>
      <PageHeader
        title="Học sinh"
        description="Quản lý danh sách học sinh trong hệ thống."
        action={{
          label: "Thêm học sinh",
          onClick: () => {
            // Handle adding new student
          }
        }}
      />
      
      <DataTable
        data={mockStudents}
        columns={columns}
        onRowClick={handleRowClick}
        searchPlaceholder="Tìm học sinh theo tên, ID..."
      />
      
      {selectedStudent && (
        <DetailPanel
          title="Thông tin học sinh"
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          footerContent={
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline">Sửa thông tin</Button>
              <Button>Ghi danh lớp mới</Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedStudent.hinh_anh_hoc_sinh} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {selectedStudent.ten_hoc_sinh.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="mt-4 text-xl font-bold">{selectedStudent.ten_hoc_sinh}</h3>
              
              <div className="mt-1 flex items-center">
                <Badge className={cn(STATUS_COLORS[selectedStudent.trang_thai as keyof typeof STATUS_COLORS] || STATUS_COLORS.default)}>
                  {selectedStudent.trang_thai === "active" && "Đang học"}
                  {selectedStudent.trang_thai === "inactive" && "Nghỉ học"}
                  {selectedStudent.trang_thai === "pending" && "Chờ xác nhận"}
                </Badge>
              </div>
              
              <p className="mt-2 text-sm text-muted-foreground">
                ID: {selectedStudent.id}
              </p>
            </div>
            
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="classes">Lớp học</TabsTrigger>
                <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-muted-foreground">Ngày sinh</p>
                      <p className="font-medium">
                        {new Date(selectedStudent.ngay_sinh).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      <School className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-muted-foreground">Chương trình học</p>
                      <p className="font-medium">{selectedStudent.ct_hoc}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-full p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-muted-foreground">Hạn học phí</p>
                      <p className="font-medium">
                        {new Date(selectedStudent.han_hoc_phi || "").toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="mb-4 text-sm font-semibold">Thông tin phụ huynh</h4>
                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Tên phụ huynh</p>
                      <p>{selectedStudent.ten_PH}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <p>{selectedStudent.sdt_ph1}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <p>{selectedStudent.email_ph1}</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <p>{selectedStudent.dia_chi}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="classes" className="pt-4">
                <div className="rounded-lg border">
                  <div className="p-4">
                    <h4 className="font-medium">Lớp đang học</h4>
                  </div>
                  <ul className="divide-y">
                    <li className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">Toán nâng cao 10A</p>
                        <p className="text-sm text-muted-foreground">Thứ 2, 4, 6 - 18:00-19:30</p>
                      </div>
                      <Badge>Đang học</Badge>
                    </li>
                    <li className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">Tiếng Anh cơ bản 10B</p>
                        <p className="text-sm text-muted-foreground">Thứ 3, 5 - 17:30-19:00</p>
                      </div>
                      <Badge>Đang học</Badge>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 rounded-lg border">
                  <div className="p-4">
                    <h4 className="font-medium">Lịch sử lớp học</h4>
                  </div>
                  <ul className="divide-y">
                    <li className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">Vật lý cơ bản 9A</p>
                        <p className="text-sm text-muted-foreground">01/09/2022 - 31/05/2023</p>
                      </div>
                      <Badge variant="outline">Hoàn thành</Badge>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="attendance" className="pt-4">
                <div className="rounded-lg border">
                  <div className="flex items-center justify-between p-4">
                    <h4 className="font-medium">Điểm danh gần đây</h4>
                    <Button variant="outline" size="sm">Xem tất cả</Button>
                  </div>
                  <ul className="divide-y">
                    <li className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">Toán nâng cao 10A</p>
                        <p className="text-sm text-muted-foreground">15/06/2023 - 18:00-19:30</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Có mặt
                      </Badge>
                    </li>
                    <li className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">Tiếng Anh cơ bản 10B</p>
                        <p className="text-sm text-muted-foreground">14/06/2023 - 17:30-19:00</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Có mặt
                      </Badge>
                    </li>
                    <li className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">Toán nâng cao 10A</p>
                        <p className="text-sm text-muted-foreground">12/06/2023 - 18:00-19:30</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Vắng mặt
                      </Badge>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DetailPanel>
      )}
    </>
  );
};

export default Students;
