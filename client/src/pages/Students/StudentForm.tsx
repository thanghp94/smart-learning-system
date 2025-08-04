
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student } from "@/lib/types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { facilityService } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { studentSchema, StudentFormValues } from "./schemas/studentSchema";
import PersonalInfoFields from "./components/PersonalInfoFields";
import ParentInfoFields from "./components/ParentInfoFields";
import TuitionFeeFields from "./components/TuitionFeeFields";
import AdditionalInfoFields from "./components/AdditionalInfoFields";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/common/ImageUpload";
import { Label } from "@/components/ui/label";

interface StudentFormProps {
  initialData?: Partial<Student>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSaving = false
}) => {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
  const [studentImage, setStudentImage] = useState(initialData?.anh_minh_hoc || initialData?.hinh_anh_hoc_sinh || '');
  const [activeTab, setActiveTab] = useState('personal');

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
    ngay_sinh: initialData.ngay_sinh ? new Date(initialData.ngay_sinh) : undefined,
    han_hoc_phi: initialData.han_hoc_phi ? new Date(initialData.han_hoc_phi) : undefined,
    ngay_bat_dau_hoc_phi: initialData.ngay_bat_dau_hoc_phi ? new Date(initialData.ngay_bat_dau_hoc_phi) : undefined,
  } : undefined;
  
  const defaultValues: Partial<StudentFormValues> = {
    ten_hoc_sinh: processedInitialData?.ten_hoc_sinh || "",
    gioi_tinh: processedInitialData?.gioi_tinh || "",
    ngay_sinh: processedInitialData?.ngay_sinh,
    co_so_id: processedInitialData?.co_so_id || "",
    ten_PH: processedInitialData?.ten_PH || "",
    sdt_ph1: processedInitialData?.sdt_ph1 || "",
    email_ph1: processedInitialData?.email_ph1 || "",
    dia_chi: processedInitialData?.dia_chi || "",
    password: processedInitialData?.password || "",
    trang_thai: processedInitialData?.trang_thai || "active",
    ct_hoc: processedInitialData?.ct_hoc || "",
    han_hoc_phi: processedInitialData?.han_hoc_phi,
    ngay_bat_dau_hoc_phi: processedInitialData?.ngay_bat_dau_hoc_phi,
    ghi_chu: processedInitialData?.ghi_chu || "",
    parentpassword: processedInitialData?.parentpassword || "",
  };

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues
  });

  const handleImageChange = (url: string) => {
    setStudentImage(url);
  };

  const handleSubmit = async (values: StudentFormValues) => {
    const submissionData = {
      ...values,
      anh_minh_hoc: studentImage,
      hinh_anh_hoc_sinh: studentImage // set both fields for compatibility
    };
    
    console.log("Form values submitted:", submissionData);
    await onSubmit(submissionData);
  };

  const nextTab = () => {
    if (activeTab === 'personal') setActiveTab('parent');
    else if (activeTab === 'parent') setActiveTab('additional');
  };

  const prevTab = () => {
    if (activeTab === 'additional') setActiveTab('parent');
    else if (activeTab === 'parent') setActiveTab('personal');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="parent">Thông tin phụ huynh</TabsTrigger>
            <TabsTrigger value="additional">Thông tin bổ sung</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 pt-4">
            <div className="mb-6">
              <Label htmlFor="studentImage">Hình ảnh học sinh</Label>
              <div className="mt-2">
                <ImageUpload
                  value={studentImage}
                  onChange={handleImageChange}
                  onUpload={handleImageChange}
                  onRemove={() => setStudentImage('')}
                />
              </div>
            </div>
            
            <PersonalInfoFields 
              form={form} 
              facilities={facilities} 
              isLoadingFacilities={isLoadingFacilities} 
            />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                Hủy
              </Button>
              <Button type="button" onClick={nextTab}>
                Tiếp theo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="parent" className="space-y-4 pt-4">
            <ParentInfoFields form={form} />
            
            <div className="flex justify-between space-x-2">
              <Button type="button" variant="outline" onClick={prevTab}>
                Quay lại
              </Button>
              <Button type="button" onClick={nextTab}>
                Tiếp theo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4 pt-4">
            <TuitionFeeFields form={form} />
            <AdditionalInfoFields form={form} />

            <div className="flex justify-between space-x-2">
              <Button type="button" variant="outline" onClick={prevTab}>
                Quay lại
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default StudentForm;
