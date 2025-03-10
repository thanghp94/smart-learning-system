
import React, { useState, useEffect } from "react";
import { Student, Enrollment, Finance, Event, File, Evaluation } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { GraduationCap, DollarSign, Calendar, FileText, Star } from "lucide-react";
import { formatDate, formatCurrency, formatStatus } from "@/utils/format";
import { 
  enrollmentService, 
  financeService, 
  eventService, 
  fileService,
  evaluationService
} from "@/lib/supabase";

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollmentsData, financesData, eventsData, filesData, evaluationsData] = await Promise.all([
          enrollmentService.getByStudent(student.id),
          financeService.getByEntity("student", student.id),
          eventService.getByEntity("student", student.id),
          fileService.getByEntity("student", student.id),
          evaluationService.getByStudent(student.id)
        ]);
        
        setEnrollments(enrollmentsData);
        setFinances(financesData);
        setEvents(eventsData);
        setFiles(filesData);
        setEvaluations(evaluationsData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    
    fetchData();
  }, [student.id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{student.ten_hoc_sinh}</h2>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Giới tính:</p>
          <p>{student.gioi_tinh || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Ngày sinh:</p>
          <p>{formatDate(student.ngay_sinh)}</p>
        </div>
        <div>
          <p className="font-medium">Phụ huynh:</p>
          <p>{student.ten_ph || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">SĐT phụ huynh:</p>
          <p>{student.sdt_ph1 || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Email phụ huynh:</p>
          <p>{student.email_ph1 || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Địa chỉ:</p>
          <p>{student.dia_chi || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Chương trình học:</p>
          <p>{student.ct_hoc || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Trạng thái:</p>
          <Badge variant={student.trang_thai === "active" ? "default" : "secondary"}>
            {formatStatus(student.trang_thai)}
          </Badge>
        </div>
        {student.mo_ta_hs && (
          <div className="col-span-2">
            <p className="font-medium">Mô tả học sinh:</p>
            <p>{student.mo_ta_hs}</p>
          </div>
        )}
      </div>

      <Separator />

      <Tabs defaultValue="enrollments" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="enrollments">
            <GraduationCap className="h-4 w-4 mr-2" />
            Ghi danh
          </TabsTrigger>
          <TabsTrigger value="finances">
            <DollarSign className="h-4 w-4 mr-2" />
            Học phí
          </TabsTrigger>
          <TabsTrigger value="files">
            <FileText className="h-4 w-4 mr-2" />
            Tài liệu
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Sự kiện
          </TabsTrigger>
          <TabsTrigger value="evaluations">
            <Star className="h-4 w-4 mr-2" />
            Đánh giá
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments" className="py-4">
          {enrollments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.lop_chi_tiet_id}</TableCell>
                    <TableCell>
                      <Badge variant={enrollment.tinh_trang_diem_danh === "present" ? "default" : "outline"}>
                        {enrollment.tinh_trang_diem_danh === "present" ? "Có mặt" : 
                         enrollment.tinh_trang_diem_danh === "absent" ? "Vắng mặt" : 
                         enrollment.tinh_trang_diem_danh === "late" ? "Đi trễ" : 
                         enrollment.tinh_trang_diem_danh}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {enrollment.nhan_xet_tieu_chi_1 || enrollment.nhan_xet_tieu_chi_2 || enrollment.nhan_xet_tieu_chi_3 ? (
                        <Badge variant="secondary">Có đánh giá</Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{enrollment.ghi_chu || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có dữ liệu ghi danh</p>
          )}
        </TabsContent>

        <TabsContent value="finances" className="py-4">
          {finances.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tên phí</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finances.map((finance) => (
                  <TableRow key={finance.id}>
                    <TableCell>{formatDate(finance.ngay)}</TableCell>
                    <TableCell>{finance.loai_thu_chi || "N/A"}</TableCell>
                    <TableCell>{finance.ten_phi || finance.dien_giai || "N/A"}</TableCell>
                    <TableCell>{formatCurrency(finance.tong_tien)}</TableCell>
                    <TableCell>
                      <Badge variant={finance.tinh_trang === "completed" ? "default" : "outline"}>
                        {formatStatus(finance.tinh_trang)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có dữ liệu học phí</p>
          )}
        </TabsContent>

        <TabsContent value="files" className="py-4">
          {files.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tài liệu</TableHead>
                  <TableHead>Nhóm tài liệu</TableHead>
                  <TableHead>Ngày cấp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.ten_tai_lieu}</TableCell>
                    <TableCell>{file.nhom_tai_lieu || "N/A"}</TableCell>
                    <TableCell>{formatDate(file.ngay_cap)}</TableCell>
                    <TableCell>
                      <Badge variant={file.trang_thai === "active" ? "default" : "secondary"}>
                        {formatStatus(file.trang_thai)}
                      </Badge>
                    </TableCell>
                    <TableCell>{file.ghi_chu || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có tài liệu</p>
          )}
        </TabsContent>

        <TabsContent value="events" className="py-4">
          {events.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sự kiện</TableHead>
                  <TableHead>Loại sự kiện</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.ten_su_kien}</TableCell>
                    <TableCell>{event.loai_su_kien || "N/A"}</TableCell>
                    <TableCell>{formatDate(event.ngay_bat_dau)}</TableCell>
                    <TableCell>{event.dia_diem || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={event.trang_thai === "completed" ? "default" : "outline"}>
                        {formatStatus(event.trang_thai)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có sự kiện</p>
          )}
        </TabsContent>

        <TabsContent value="evaluations" className="py-4">
          {evaluations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên đánh giá</TableHead>
                  <TableHead>Ngày đánh giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>{evaluation.ten_danh_gia}</TableCell>
                    <TableCell>{formatDate(evaluation.ngay_dau_dot_danh_gia)}</TableCell>
                    <TableCell>
                      <Badge variant={evaluation.trang_thai === "completed" ? "default" : "outline"}>
                        {formatStatus(evaluation.trang_thai)}
                      </Badge>
                    </TableCell>
                    <TableCell>{evaluation.ghi_chu || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có đánh giá</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
