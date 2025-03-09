
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
import { Loader2 } from "lucide-react";

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

  // Process initial data to match form structure
  const processedInitialData = initialData ? {
    ...initialData,
  } : undefined;
  
  const defaultValues: Partial<StudentFormValues> = {
    ten_hoc_sinh: processedInitialData?.ten_hoc_sinh || "",
    gioi_tinh: processedInitialData?.gioi_tinh || "",
    ngay_sinh: processedInitialData?.ngay_sinh ? new Date(processedInitialData.ngay_sinh) : undefined,
    co_so_id: processedInitialData?.co_so_id || "",
    ten_PH: processedInitialData?.ten_PH || "",
    sdt_ph1: processedInitialData?.sdt_ph1 || "",
    email_ph1: processedInitialData?.email_ph1 || "",
    dia_chi: processedInitialData?.dia_chi || "",
    password: processedInitialData?.password || "",
    trang_thai: processedInitialData?.trang_thai || "active",
    ct_hoc: processedInitialData?.ct_hoc || "",
    han_hoc_phi: processedInitialData?.han_hoc_phi ? new Date(processedInitialData.han_hoc_phi) : undefined,
    ngay_bat_dau_hoc_phi: processedInitialData?.ngay_bat_dau_hoc_phi ? new Date(processedInitialData.ngay_bat_dau_hoc_phi) : undefined,
    ghi_chu: processedInitialData?.ghi_chu || "",
    parentpassword: processedInitialData?.parentpassword || "",
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
