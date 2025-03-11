
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TeachingSession } from "@/lib/types";
import { SessionFormData } from "./schemas/sessionSchema";
import { useSessionForm } from "./hooks/useSessionForm";
import SessionBasicInfoFields from "./components/SessionBasicInfoFields";
import SessionContentField from "./components/SessionContentField";

interface SessionFormProps {
  initialData?: Partial<TeachingSession>;
  onSubmit: (data: Partial<TeachingSession>) => void;
  isEdit?: boolean;
  onCancel?: () => void;
}

const SessionForm = ({ initialData, onSubmit, isEdit = false, onCancel }: SessionFormProps) => {
  const { form, classes, teachers, isLoading } = useSessionForm({ initialData });

  const handleSubmit = (data: SessionFormData) => {
    // Convert session_id to string if it's a number
    if (typeof data.session_id === 'number') {
      data.session_id = String(data.session_id);
    }
    
    // Prepare the session data with all required fields for the database
    const sessionData: Partial<TeachingSession> = {
      lop_chi_tiet_id: data.lop_chi_tiet_id,
      giao_vien: data.giao_vien,
      ngay_hoc: data.ngay_hoc,
      thoi_gian_bat_dau: data.thoi_gian_bat_dau,
      thoi_gian_ket_thuc: data.thoi_gian_ket_thuc,
      session_id: data.session_id,
      loai_bai_hoc: data.loai_bai_hoc,
      phong_hoc_id: data.phong_hoc_id,
      tro_giang: data.tro_giang,
      co_so_id: data.co_so_id,
      noi_dung: data.noi_dung,
      ghi_chu: data.ghi_chu
    };
    
    // Submit session data through the onSubmit prop
    onSubmit(sessionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <SessionBasicInfoFields 
          form={form} 
          classes={classes} 
          teachers={teachers} 
          isLoading={isLoading} 
        />
        
        <SessionContentField form={form} />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit">{isEdit ? "Cập nhật" : "Thêm mới"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default SessionForm;
