import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { evaluationService, teachingSessionService } from '@/lib/supabase';
import { Evaluation, TeachingSession } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge"
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { DatePicker } from "@/components/ui/date-picker"
import { z } from "zod"

const formSchema = z.object({
  ten_danh_gia: z.string().min(2, {
    message: "Tên đánh giá phải có ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Vui lòng nhập đúng định dạng email.",
  }),
  nhan_xet_chi_tiet_1: z.string().optional(),
  nhan_xet_chi_tiet_2: z.string().optional(),
  nhan_xet_chi_tiet_3: z.string().optional(),
  nhan_xet_chi_tiet_4: z.string().optional(),
  nhan_xet_chi_tiet_5: z.string().optional(),
  nhan_xet_chi_tiet_6: z.string().optional(),
  nhan_xet_chi_tiet_7: z.string().optional(),
  nhan_xet_chung: z.string().optional(),
  nhan_xet_cua_cap_tren: z.string().optional(),
  nhan_xet_tong_hop: z.string().optional(),
  tieu_chi_1: z.string().optional(),
  tieu_chi_2: z.string().optional(),
  tieu_chi_3: z.string().optional(),
  tieu_chi_4: z.string().optional(),
  tieu_chi_5: z.string().optional(),
  tieu_chi_6: z.string().optional(),
  tieu_chi_7: z.string().optional(),
  ngay_dau_dot_danh_gia: z.date(),
  ngay_cuoi_dot_danh_gia: z.date(),
  han_hoan_thanh: z.date(),
})

interface EvaluationFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: Evaluation) => void;
  initialData?: Evaluation;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ open, setOpen, onSubmit, initialData }) => {
  const [selectedSession, setSelectedSession] = useState<TeachingSession | null>(null);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [sessionList, setSessionList] = useState<TeachingSession[]>([]);
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const teachingSessionId = searchParams.get('teachingSessionId')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ten_danh_gia: initialData?.ten_danh_gia || "",
      email: initialData?.email || "",
      nhan_xet_chi_tiet_1: initialData?.nhan_xet_chi_tiet_1 || "",
      nhan_xet_chi_tiet_2: initialData?.nhan_xet_chi_tiet_2 || "",
      nhan_xet_chi_tiet_3: initialData?.nhan_xet_chi_tiet_3 || "",
      nhan_xet_chi_tiet_4: initialData?.nhan_xet_chi_tiet_4 || "",
      nhan_xet_chi_tiet_5: initialData?.nhan_xet_chi_tiet_5 || "",
      nhan_xet_chi_tiet_6: initialData?.nhan_xet_chi_tiet_6 || "",
      nhan_xet_chi_tiet_7: initialData?.nhan_xet_chi_tiet_7 || "",
      nhan_xet_chung: initialData?.nhan_xet_chung || "",
      nhan_xet_cua_cap_tren: initialData?.nhan_xet_cua_cap_tren || "",
      nhan_xet_tong_hop: initialData?.nhan_xet_tong_hop || "",
      tieu_chi_1: initialData?.tieu_chi_1 || "",
      tieu_chi_2: initialData?.tieu_chi_2 || "",
      tieu_chi_3: initialData?.tieu_chi_3 || "",
      tieu_chi_4: initialData?.tieu_chi_4 || "",
      tieu_chi_5: initialData?.tieu_chi_5 || "",
      tieu_chi_6: initialData?.tieu_chi_6 || "",
      tieu_chi_7: initialData?.tieu_chi_7 || "",
      ngay_dau_dot_danh_gia: initialData?.ngay_dau_dot_danh_gia ? new Date(initialData.ngay_dau_dot_danh_gia) : new Date(),
      ngay_cuoi_dot_danh_gia: initialData?.ngay_cuoi_dot_danh_gia ? new Date(initialData.ngay_cuoi_dot_danh_gia) : new Date(),
      han_hoan_thanh: initialData?.han_hoan_thanh ? new Date(initialData.han_hoan_thanh) : new Date(),
    }
  })

  useEffect(() => {
    const fetchTeachingSession = async () => {
      if (teachingSessionId) {
        try {
          const session = await teachingSessionService.getById(teachingSessionId);
          if (session) {
            setSelectedSession(session);
          } else {
            toast({
              title: "Không tìm thấy buổi học",
              description: "Không thể tải thông tin buổi học.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error fetching teaching session:", error);
          toast({
            title: "Lỗi",
            description: "Không thể tải thông tin buổi học.",
            variant: "destructive",
          })
        }
      }
    };

    fetchTeachingSession();
  }, [teachingSessionId, toast]);

  const handleSessionSelect = async (session: TeachingSession) => {
    setSelectedSession(session);
    setIsSessionDialogOpen(false);
  };

  const onOpenChange = () => {
    setOpen(!open)
  }

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const evaluationData: Evaluation = {
      ...values,
      id: initialData?.id || uuidv4(),
      doi_tuong: "teaching_session",
      ghi_danh_id: selectedSession?.id,
      nhanvien_id: selectedSession?.giao_vien,
      ten_danh_gia: values.ten_danh_gia,
      email: values.email,
      hinh_anh: selectedSession?.id,
      ngay_dau_dot_danh_gia: values.ngay_dau_dot_danh_gia,
      ngay_cuoi_dot_danh_gia: values.ngay_cuoi_dot_danh_gia,
      han_hoan_thanh: values.han_hoan_thanh,
      tieu_chi_1: values.tieu_chi_1,
      tieu_chi_2: values.tieu_chi_2,
      tieu_chi_3: values.tieu_chi_3,
      tieu_chi_4: values.tieu_chi_4,
      tieu_chi_5: values.tieu_chi_5,
      tieu_chi_6: values.tieu_chi_6,
      tieu_chi_7: values.tieu_chi_7,
      nhan_xet_chi_tiet_1: values.nhan_xet_chi_tiet_1,
      nhan_xet_chi_tiet_2: values.nhan_xet_chi_tiet_2,
      nhan_xet_chi_tiet_3: values.nhan_xet_chi_tiet_3,
      nhan_xet_chi_tiet_4: values.nhan_xet_chi_tiet_4,
      nhan_xet_chi_tiet_5: values.nhan_xet_chi_tiet_5,
      nhan_xet_chi_tiet_6: values.nhan_xet_chi_tiet_6,
      nhan_xet_chi_tiet_7: values.nhan_xet_chi_tiet_7,
      nhan_xet_chung: values.nhan_xet_chung,
      nhan_xet_cua_cap_tren: values.nhan_xet_cua_cap_tren,
      nhan_xet_tong_hop: values.nhan_xet_tong_hop,
      trang_thai: initialData?.trang_thai || "pending",
    };

    onSubmit(evaluationData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Đánh Giá Buổi Học</DialogTitle>
          <DialogDescription>
            Chọn buổi học và điền thông tin đánh giá.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Tên đánh giá</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên đánh giá" {...form.register("ten_danh_gia")} />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập email" {...form.register("email")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Chọn buổi học</FormLabel>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsSessionDialogOpen(true)}>
                  Chọn từ danh sách
                </Button>
                {selectedSession ? (
                  <Badge variant="secondary">
                    Đã chọn: {selectedSession.noi_dung_bai_hoc}
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Chưa chọn buổi học
                  </Badge>
                )}
              </div>
            </FormItem>

            {selectedSession && (
              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Loại bài học</FormLabel>
                  <FormControl>
                    <Input value={selectedSession?.loai_bai_hoc || ''} readOnly disabled />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Ngày học</FormLabel>
                  <FormControl>
                    <Input value={selectedSession?.ngay_hoc || ''} readOnly disabled />
                  </FormControl>
                </FormItem>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>Ngày bắt đầu đợt đánh giá</FormLabel>
                <FormControl>
                  <DatePicker
                    onSelect={(date) => form.setValue("ngay_dau_dot_danh_gia", date)}
                  />
                </FormControl>
                <FormDescription>
                  Chọn ngày bắt đầu đợt đánh giá.
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>Ngày kết thúc đợt đánh giá</FormLabel>
                <FormControl>
                  <DatePicker
                    onSelect={(date) => form.setValue("ngay_cuoi_dot_danh_gia", date)}
                  />
                </FormControl>
                <FormDescription>
                  Chọn ngày kết thúc đợt đánh giá.
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>Hạn hoàn thành</FormLabel>
                <FormControl>
                  <DatePicker
                    onSelect={(date) => form.setValue("han_hoan_thanh", date)}
                  />
                </FormControl>
                <FormDescription>
                  Chọn hạn hoàn thành đánh giá.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Tiêu chí 1</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu chí 1" {...form.register("tieu_chi_1")} />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Tiêu chí 2</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu chí 2" {...form.register("tieu_chi_2")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Tiêu chí 3</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu chí 3" {...form.register("tieu_chi_3")} />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Tiêu chí 4</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu chí 4" {...form.register("tieu_chi_4")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Tiêu chí 5</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu chí 5" {...form.register("tieu_chi_5")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Tiêu chí 6</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu chí 6" {...form.register("tieu_chi_6")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Tiêu chí 7</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu chí 7" {...form.register("tieu_chi_7")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Nhận xét chi tiết 1</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nhận xét chi tiết 1" {...form.register("nhan_xet_chi_tiet_1")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Nhận xét chi tiết 2</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nhận xét chi tiết 2" {...form.register("nhan_xet_chi_tiet_2")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Nhận xét chi tiết 3</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nhận xét chi tiết 3" {...form.register("nhan_xet_chi_tiet_3")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Nhận xét chi tiết 4</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nhận xét chi tiết 4" {...form.register("nhan_xet_chi_tiet_4")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Nhận xét chi tiết 5</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nhận xét chi tiết 5" {...form.register("nhan_xet_chi_tiet_5")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Nhận xét chi tiết 6</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nhận xét chi tiết 6" {...form.register("nhan_xet_chi_tiet_6")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Nhận xét chi tiết 7</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nhận xét chi tiết 7" {...form.register("nhan_xet_chi_tiet_7")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Nhận xét chung</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nhận xét chung" {...form.register("nhan_xet_chung")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Nhận xét của cấp trên</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nhận xét của cấp trên" {...form.register("nhan_xet_cua_cap_tren")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Nhận xét tổng hợp</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nhận xét tổng hợp" {...form.register("nhan_xet_tong_hop")} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <Button type="submit">Gửi đánh giá</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationForm;
