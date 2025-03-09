
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student } from "@/lib/types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { facilityService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { studentSchema, StudentFormValues } from "./schemas/studentSchema";
import PersonalInfoFields from "./components/PersonalInfoFields";
import ParentInfoFields from "./components/ParentInfoFields";
import TuitionFeeFields from "./components/TuitionFeeFields";
import AdditionalInfoFields from "./components/AdditionalInfoFields";

interface StudentFormProps {
  initialData?: Partial<Student>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setIsLoadingFacilities(true);
        const data = await facilityService.getAll();
        setFacilities(data);
      } catch (error) {
        console.error("Error loading facilities:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách cơ sở",
          variant: "destructive",
        });
      } finally {
        setIsLoadingFacilities(false);
      }
    };

    loadFacilities();
  }, [toast]);

  const defaultValues: Partial<StudentFormValues> = {
    ten_hoc_sinh: initialData?.ten_hoc_sinh || "",
    gioi_tinh: initialData?.gioi_tinh || "",
    ngay_sinh: initialData?.ngay_sinh ? new Date(initialData.ngay_sinh) : undefined,
    co_so_ID: initialData?.co_so_ID || "",
    ten_PH: initialData?.ten_PH || "",
    sdt_ph1: initialData?.sdt_ph1 || "",
    email_ph1: initialData?.email_ph1 || "",
    dia_chi: initialData?.dia_chi || "",
    password: initialData?.password || "",
    trang_thai: initialData?.trang_thai || "active",
    ct_hoc: initialData?.ct_hoc || "",
    han_hoc_phi: initialData?.han_hoc_phi ? new Date(initialData.han_hoc_phi) : undefined,
    ngay_bat_dau_hoc_phi: initialData?.ngay_bat_dau_hoc_phi ? new Date(initialData.ngay_bat_dau_hoc_phi) : undefined,
    ghi_chu: initialData?.ghi_chu || "",
    parentpassword: initialData?.parentpassword || "",
  };

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues
  });

  const handleSubmit = async (values: StudentFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Form data to submit:", values);
      
      // Format the data for API submission
      const formattedData = {
        ...values,
        ngay_sinh: values.ngay_sinh ? values.ngay_sinh : null,
        han_hoc_phi: values.han_hoc_phi ? values.han_hoc_phi : null,
        ngay_bat_dau_hoc_phi: values.ngay_bat_dau_hoc_phi ? values.ngay_bat_dau_hoc_phi : null,
      };
      
      await onSubmit(formattedData);
    } catch (error) {
      console.error("Error submitting student form:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu thông tin học sinh",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields 
          form={form} 
          facilities={facilities} 
          isLoadingFacilities={isLoadingFacilities} 
        />
        
        <ParentInfoFields form={form} />
        
        <TuitionFeeFields form={form} />
        
        <AdditionalInfoFields form={form} />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentForm;
