
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Asset } from "@/lib/types";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const assetSchema = z.object({
  ten_CSVC: z.string().min(2, { message: "Tên tài sản phải có ít nhất 2 ký tự" }),
  loai: z.string().optional(),
  danh_muc: z.string().optional(),
  don_vi: z.string().min(1, { message: "Đơn vị là bắt buộc" }),
  so_luong: z.coerce.number().min(0).default(0),
  tinh_trang: z.string().default("active"),
  trang_thai_so_huu: z.string().optional(),
  mo_ta_1: z.string().optional(),
  ghi_chu: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetFormProps {
  initialData?: Partial<Asset>;
  onSubmit: (data: AssetFormValues) => void;
  onCancel: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { toast } = useToast();
  
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      ten_CSVC: initialData?.ten_CSVC || "",
      loai: initialData?.loai || "",
      danh_muc: initialData?.danh_muc || "",
      don_vi: initialData?.don_vi || "",
      so_luong: initialData?.so_luong || 0,
      tinh_trang: initialData?.tinh_trang || "active",
      trang_thai_so_huu: initialData?.trang_thai_so_huu || "",
      mo_ta_1: initialData?.mo_ta_1 || "",
      ghi_chu: initialData?.ghi_chu || "",
    },
  });

  const handleSubmit = (values: AssetFormValues) => {
    try {
      onSubmit(values);
    } catch (error) {
      console.error("Error submitting asset form:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu thông tin tài sản",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ten_CSVC"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên tài sản <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên tài sản" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại</FormLabel>
                <FormControl>
                  <Input placeholder="Loại tài sản" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="danh_muc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <FormControl>
                  <Input placeholder="Danh mục" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="don_vi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn vị <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Đơn vị" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="so_luong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tinh_trang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tình trạng</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tình trạng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="good">Tốt</SelectItem>
                    <SelectItem value="damaged">Hư hỏng</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trang_thai_so_huu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái sở hữu</FormLabel>
                <FormControl>
                  <Input placeholder="Trạng thái sở hữu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="mo_ta_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả chi tiết về tài sản" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ghi_chu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Ghi chú thêm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  );
};

export default AssetForm;
