
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil } from "lucide-react";
import { Student, Enrollment, Finance, Contact, Event } from "@/lib/types";
import { enrollmentService, financeService, eventService, contactService } from "@/lib/supabase";
import DataTable from "@/components/ui/DataTable";
import EnrollStudentButton from "./EnrollStudentButton";

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState({
    enrollments: true,
    finances: true,
    events: true,
    contacts: true
  });

  useEffect(() => {
    fetchStudentRelatedData();
  }, [student.id]);

  const fetchStudentRelatedData = async () => {
    try {
      // Fetch enrollments
      setLoading(prev => ({ ...prev, enrollments: true }));
      const enrollmentsData = await enrollmentService.getByStudent(student.id);
      setEnrollments(enrollmentsData || []);
      setLoading(prev => ({ ...prev, enrollments: false }));

      // Fetch finances (học phí)
      setLoading(prev => ({ ...prev, finances: true }));
      const financesData = await financeService.getByEntity('student', student.id);
      setFinances(financesData || []);
      setLoading(prev => ({ ...prev, finances: false }));

      // Fetch events related to this student
      setLoading(prev => ({ ...prev, events: true }));
      const eventsData = await eventService.getByEntity('student', student.id);
      setEvents(eventsData || []);
      setLoading(prev => ({ ...prev, events: false }));

      // Fetch contacts related to this student
      setLoading(prev => ({ ...prev, contacts: true }));
      const contactsData = await contactService.getByType('student');
      const filteredContacts = contactsData.filter(contact => contact.doi_tuong_id === student.id);
      setContacts(filteredContacts || []);
      setLoading(prev => ({ ...prev, contacts: false }));
      
    } catch (error) {
      console.error("Error fetching student related data:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/students/edit/${student.id}`);
  };

  const handleBackClick = () => {
    navigate('/students');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="outline" onClick={handleBackClick} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
          <h1 className="text-2xl font-bold">{student.ten_hoc_sinh}</h1>
        </div>
        <div className="flex space-x-2">
          <EnrollStudentButton studentId={student.id} onEnrollmentComplete={fetchStudentRelatedData} />
          <Button onClick={handleEditClick}>
            <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Thông tin chi tiết</TabsTrigger>
          <TabsTrigger value="enrollments">Ghi danh</TabsTrigger>
          <TabsTrigger value="tuition">Học phí</TabsTrigger>
          <TabsTrigger value="events">Sự kiện</TabsTrigger>
          <TabsTrigger value="contacts">Liên lạc</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin học sinh</CardTitle>
              <CardDescription>Chi tiết thông tin cá nhân của học sinh</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Họ và tên</h3>
                <p className="text-lg">{student.ten_hoc_sinh}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Giới tính</h3>
                <p className="text-lg">{student.gioi_tinh || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Ngày sinh</h3>
                <p className="text-lg">{student.ngay_sinh ? new Date(student.ngay_sinh.toString()).toLocaleDateString() : "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Phụ huynh</h3>
                <p className="text-lg">{student.ten_PH || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Số điện thoại phụ huynh</h3>
                <p className="text-lg">{student.sdt_ph1 || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Email phụ huynh</h3>
                <p className="text-lg">{student.email_ph1 || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Địa chỉ</h3>
                <p className="text-lg">{student.dia_chi || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Trạng thái</h3>
                <p className="text-lg">{student.trang_thai || "Đang học"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Chương trình học</h3>
                <p className="text-lg">{student.ct_hoc || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Hạn học phí</h3>
                <p className="text-lg">{student.han_hoc_phi ? new Date(student.han_hoc_phi.toString()).toLocaleDateString() : "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Ghi chú</h3>
                <p className="text-lg">{student.ghi_chu || "Không có ghi chú"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle>Ghi danh</CardTitle>
              <CardDescription>Các lớp học sinh đã ghi danh</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.enrollments ? (
                <p>Đang tải dữ liệu...</p>
              ) : enrollments.length > 0 ? (
                <DataTable 
                  data={enrollments} 
                  columns={[
                    { accessorKey: 'ten_lop_full', header: 'Tên lớp' },
                    { accessorKey: 'ct_hoc', header: 'Chương trình học' },
                    { accessorKey: 'created_at', header: 'Ngày ghi danh', 
                      cell: ({ row }) => row.original.created_at ? 
                        new Date(row.original.created_at).toLocaleDateString() : 'N/A' 
                    },
                    { accessorKey: 'tinh_trang_diem_danh', header: 'Tình trạng điểm danh' }
                  ]}
                />
              ) : (
                <p>Học sinh chưa ghi danh vào lớp nào</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tuition">
          <Card>
            <CardHeader>
              <CardTitle>Học phí</CardTitle>
              <CardDescription>Lịch sử thanh toán học phí</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.finances ? (
                <p>Đang tải dữ liệu...</p>
              ) : finances.length > 0 ? (
                <DataTable 
                  data={finances} 
                  columns={[
                    { accessorKey: 'ngay', header: 'Ngày', 
                      cell: ({ row }) => row.original.ngay ? 
                        new Date(row.original.ngay).toLocaleDateString() : 'N/A' 
                    },
                    { accessorKey: 'ten_phi', header: 'Tên phí' },
                    { accessorKey: 'tong_tien', header: 'Số tiền',
                      cell: ({ row }) => new Intl.NumberFormat('vi-VN', { 
                        style: 'currency', currency: 'VND' 
                      }).format(row.original.tong_tien)
                    },
                    { accessorKey: 'tinh_trang', header: 'Tình trạng' },
                    { accessorKey: 'kieu_thanh_toan', header: 'Kiểu thanh toán' }
                  ]}
                />
              ) : (
                <p>Không có dữ liệu học phí</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Sự kiện</CardTitle>
              <CardDescription>Các sự kiện liên quan đến học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.events ? (
                <p>Đang tải dữ liệu...</p>
              ) : events.length > 0 ? (
                <DataTable 
                  data={events} 
                  columns={[
                    { accessorKey: 'ten_su_kien', header: 'Tên sự kiện' },
                    { accessorKey: 'loai_su_kien', header: 'Loại sự kiện' },
                    { accessorKey: 'ngay_bat_dau', header: 'Ngày diễn ra', 
                      cell: ({ row }) => row.original.ngay_bat_dau ? 
                        new Date(row.original.ngay_bat_dau).toLocaleDateString() : 'N/A' 
                    },
                    { accessorKey: 'dia_diem', header: 'Địa điểm' },
                    { accessorKey: 'trang_thai', header: 'Trạng thái' }
                  ]}
                />
              ) : (
                <p>Không có sự kiện liên quan</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Liên lạc</CardTitle>
              <CardDescription>Lịch sử liên lạc với học sinh/phụ huynh</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.contacts ? (
                <p>Đang tải dữ liệu...</p>
              ) : contacts.length > 0 ? (
                <DataTable 
                  data={contacts} 
                  columns={[
                    { accessorKey: 'ten_lien_he', header: 'Nội dung liên lạc' },
                    { accessorKey: 'phan_loai', header: 'Phân loại' },
                    { accessorKey: 'sdt', header: 'Số điện thoại' },
                    { accessorKey: 'email', header: 'Email' },
                    { accessorKey: 'created_at', header: 'Ngày tạo', 
                      cell: ({ row }) => row.original.created_at ? 
                        new Date(row.original.created_at).toLocaleDateString() : 'N/A' 
                    }
                  ]}
                />
              ) : (
                <p>Không có lịch sử liên lạc</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
