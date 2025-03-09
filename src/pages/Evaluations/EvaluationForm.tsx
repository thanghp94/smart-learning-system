
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { evaluationSchema, EvaluationFormData } from "./schemas/evaluationSchema";
import { Evaluation, TeachingSession, Student, Employee, Enrollment } from "@/lib/types";
import { evaluationService, teachingSessionService, studentService, employeeService, enrollmentService } from "@/lib/supabase";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@/components/ui/DatePicker";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";

const EvaluationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      doi_tuong: "student",
      ten_danh_gia: "",
      email: "",
      hinh_anh: "",
      ngay_dau_dot_danh_gia: new Date().toISOString().substring(0, 10),
      ngay_cuoi_dot_danh_gia: new Date().toISOString().substring(0, 10),
      han_hoan_thanh: new Date().toISOString().substring(0, 10),
      tieu_chi_1: "",
      tieu_chi_2: "",
      tieu_chi_3: "",
      tieu_chi_4: "",
      tieu_chi_5: "",
      tieu_chi_6: "",
      tieu_chi_7: "",
      nhan_xet_chi_tiet_1: "",
      nhan_xet_chi_tiet_2: "",
      nhan_xet_chi_tiet_3: "",
      nhan_xet_chi_tiet_4: "",
      nhan_xet_chi_tiet_5: "",
      nhan_xet_chi_tiet_6: "",
      nhan_xet_chi_tiet_7: "",
      nhan_xet_chung: "",
      nhan_xet_cua_cap_tren: "",
      nhan_xet_tong_hop: "",
      trang_thai: "pending",
      ghi_chu: "",
    }
  });

  const selectedObjectType = form.watch("doi_tuong");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Load data for form selections
        const [studentsData, employeesData, sessionsData, enrollmentsData] = await Promise.all([
          studentService.getAll(),
          employeeService.getAll(),
          teachingSessionService.getAll(),
          enrollmentService.getAll(),
        ]);

        setStudents(studentsData);
        setEmployees(employeesData);
        setSessions(sessionsData);
        setEnrollments(enrollmentsData);

        // If editing existing evaluation
        if (id) {
          const evaluation = await evaluationService.getById(id);
          if (evaluation) {
            form.reset({
              ...evaluation,
              // Convert dates to string format for form
              ngay_dau_dot_danh_gia: evaluation.ngay_dau_dot_danh_gia || new Date().toISOString().substring(0, 10),
              ngay_cuoi_dot_danh_gia: evaluation.ngay_cuoi_dot_danh_gia || new Date().toISOString().substring(0, 10),
              han_hoan_thanh: evaluation.han_hoan_thanh || new Date().toISOString().substring(0, 10),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form, toast]);

  const onSubmit = async (data: EvaluationFormData) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await evaluationService.update(id, data);
        toast({
          title: "Thành công",
          description: "Đã cập nhật đánh giá",
        });
      } else {
        await evaluationService.create(data);
        toast({
          title: "Thành công",
          description: "Đã tạo đánh giá mới",
        });
      }
      navigate("/evaluations");
    } catch (error) {
      console.error("Error saving evaluation:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu đánh giá",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        <span>Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Cập nhật đánh giá" : "Tạo đánh giá mới"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Object type selection */}
                <FormField
                  control={form.control}
                  name="doi_tuong"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đối tượng đánh giá</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn đối tượng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Học sinh</SelectItem>
                          <SelectItem value="employee">Nhân viên</SelectItem>
                          <SelectItem value="session">Buổi học</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reference object selection based on type */}
                {selectedObjectType === "student" && (
                  <FormField
                    control={form.control}
                    name="ghi_danh_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Học sinh</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn ghi danh học sinh" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {enrollments.map(enrollment => {
                              const student = students.find(s => s.id === enrollment.hoc_sinh_id);
                              return (
                                <SelectItem key={enrollment.id} value={enrollment.id}>
                                  {student?.ten_hoc_sinh || "Học sinh không tìm thấy"}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedObjectType === "employee" && (
                  <FormField
                    control={form.control}
                    name="nhanvien_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhân viên</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhân viên" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map(employee => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.ten_nhan_su}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Name of the evaluation */}
                <FormField
                  control={form.control}
                  name="ten_danh_gia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đánh giá</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên đánh giá" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image URL */}
                <FormField
                  control={form.control}
                  name="hinh_anh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình ảnh</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập URL hình ảnh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start date */}
                <FormField
                  control={form.control}
                  name="ngay_dau_dot_danh_gia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu đánh giá</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End date */}
                <FormField
                  control={form.control}
                  name="ngay_cuoi_dot_danh_gia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày kết thúc đánh giá</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Due date */}
                <FormField
                  control={form.control}
                  name="han_hoan_thanh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hạn hoàn thành</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="trang_thai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Chờ xử lý</SelectItem>
                          <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <h3 className="text-lg font-medium">Tiêu chí đánh giá</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Criteria 1 */}
                <FormField
                  control={form.control}
                  name="tieu_chi_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu chí 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu chí 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Evaluation 1 */}
                <FormField
                  control={form.control}
                  name="nhan_xet_chi_tiet_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhận xét tiêu chí 1</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Nhập nhận xét" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Criteria 2 */}
                <FormField
                  control={form.control}
                  name="tieu_chi_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu chí 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu chí 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Evaluation 2 */}
                <FormField
                  control={form.control}
                  name="nhan_xet_chi_tiet_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhận xét tiêu chí 2</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Nhập nhận xét" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Additional criteria fields - can be expanded as needed */}
              </div>

              <Separator />

              <div className="space-y-4">
                {/* Overall comments */}
                <FormField
                  control={form.control}
                  name="nhan_xet_chung"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhận xét chung</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập nhận xét chung"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Supervisor comments */}
                <FormField
                  control={form.control}
                  name="nhan_xet_cua_cap_tren"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhận xét của cấp trên</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập nhận xét của cấp trên"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Summary */}
                <FormField
                  control={form.control}
                  name="nhan_xet_tong_hop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhận xét tổng hợp</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập nhận xét tổng hợp"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="ghi_chu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập ghi chú"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/evaluations")}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                  {id ? "Cập nhật" : "Tạo mới"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationForm;
