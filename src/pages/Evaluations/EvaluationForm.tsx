
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TeachingSession, Class, Employee } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

const evaluationSchema = z.object({
  nhan_xet_1: z.string().optional(),
  nhan_xet_2: z.string().optional(),
  nhan_xet_3: z.string().optional(),
  nhan_xet_4: z.string().optional(),
  nhan_xet_5: z.string().optional(),
  nhan_xet_6: z.string().optional(),
  ghi_chu_danh_gia: z.string().optional(),
});

interface EvaluationFormProps {
  initialData: TeachingSession;
  onSubmit: (data: Partial<TeachingSession>) => void;
  classInfo?: Class;
  teacherInfo?: Employee;
}

const EvaluationForm = ({ initialData, onSubmit, classInfo, teacherInfo }: EvaluationFormProps) => {
  const form = useForm<z.infer<typeof evaluationSchema>>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      nhan_xet_1: initialData.nhan_xet_1?.toString() || "",
      nhan_xet_2: initialData.nhan_xet_2?.toString() || "",
      nhan_xet_3: initialData.nhan_xet_3?.toString() || "",
      nhan_xet_4: initialData.nhan_xet_4?.toString() || "",
      nhan_xet_5: initialData.nhan_xet_5?.toString() || "",
      nhan_xet_6: initialData.nhan_xet_6?.toString() || "",
      ghi_chu_danh_gia: initialData.ghi_chu_danh_gia || "",
    },
  });

  const handleSubmit = (data: z.infer<typeof evaluationSchema>) => {
    onSubmit({
      ...data,
      nhan_xet_1: data.nhan_xet_1 ? Number(data.nhan_xet_1) : null,
      nhan_xet_2: data.nhan_xet_2 ? Number(data.nhan_xet_2) : null,
      nhan_xet_3: data.nhan_xet_3 ? Number(data.nhan_xet_3) : null,
      nhan_xet_4: data.nhan_xet_4 ? Number(data.nhan_xet_4) : null,
      nhan_xet_5: data.nhan_xet_5 ? Number(data.nhan_xet_5) : null,
      nhan_xet_6: data.nhan_xet_6 ? Number(data.nhan_xet_6) : null,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Lớp:</p>
              <p className="font-medium">{classInfo?.Ten_lop_full || initialData.lop_chi_tiet_id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Giáo viên:</p>
              <p className="font-medium">{teacherInfo?.ten_nhan_su || initialData.giao_vien}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Buổi học số:</p>
              <p className="font-medium">{initialData.session_id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ngày học:</p>
              <p className="font-medium">{formatDate(initialData.ngay_hoc)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Thời gian:</p>
              <p className="font-medium">
                {initialData.thoi_gian_bat_dau?.substring(0, 5)} - {initialData.thoi_gian_ket_thuc?.substring(0, 5)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Loại bài học:</p>
              <p className="font-medium">{initialData.Loai_bai_hoc}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="nhan_xet_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4" /> Phương pháp giảng dạy (1-10)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="10" 
                      step="0.5" 
                      placeholder="Điểm số..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nhan_xet_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4" /> Kiến thức chuyên môn (1-10)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="10" 
                      step="0.5" 
                      placeholder="Điểm số..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nhan_xet_3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4" /> Kỹ năng giao tiếp (1-10)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="10" 
                      step="0.5" 
                      placeholder="Điểm số..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nhan_xet_4"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4" /> Quản lý lớp học (1-10)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="10" 
                      step="0.5" 
                      placeholder="Điểm số..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nhan_xet_5"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4" /> Tác phong chuyên nghiệp (1-10)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="10" 
                      step="0.5" 
                      placeholder="Điểm số..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nhan_xet_6"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4" /> Mức độ hài lòng (1-10)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="10" 
                      step="0.5" 
                      placeholder="Điểm số..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="ghi_chu_danh_gia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhận xét chung</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Nhập nhận xét đánh giá buổi học..." 
                    {...field} 
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
            <Button type="submit">Lưu Đánh Giá</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EvaluationForm;
