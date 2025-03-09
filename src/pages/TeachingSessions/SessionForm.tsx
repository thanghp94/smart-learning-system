
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TeachingSession } from "@/lib/types";
import { SessionFormData } from "./schemas/sessionSchema";
import { useSessionForm } from "./hooks/useSessionForm";
import SessionBasicInfoFields from "./components/SessionBasicInfoFields";
import SessionContentField from "./components/SessionContentField";
import SessionEvaluationFields from "./components/SessionEvaluationFields";

interface SessionFormProps {
  initialData?: Partial<TeachingSession>;
  onSubmit: (data: Partial<TeachingSession>) => void;
  isEdit?: boolean;
  onCancel?: () => void;
}

const SessionForm = ({ initialData, onSubmit, isEdit = false, onCancel }: SessionFormProps) => {
  const { form, classes, teachers, isLoading, calculateAverageScore } = useSessionForm({ initialData });

  const handleSubmit = (data: SessionFormData) => {
    // Convert session_id to string if it's a number
    if (typeof data.session_id === 'number') {
      data.session_id = String(data.session_id);
    }
    
    // Calculate average score if evaluation scores are provided
    const trungBinh = calculateAverageScore(data);
    
    const sessionData = {
      ...data,
      trung_binh: trungBinh
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
        
        <SessionEvaluationFields form={form} />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit">{isEdit ? "Cập nhật" : "Thêm mới"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default SessionForm;
