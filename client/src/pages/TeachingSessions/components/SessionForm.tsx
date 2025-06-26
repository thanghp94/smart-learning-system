
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TeachingSession } from "@/lib/types";
import { useSessionForm } from "../hooks/useSessionForm";
import SessionBasicInfoFields from "./SessionBasicInfoFields";
import SessionContentField from "./SessionContentField";

interface SessionFormProps {
  initialData?: Partial<TeachingSession>;
  onSubmit: (data: Partial<TeachingSession>) => void;
  isEdit?: boolean;
  onCancel?: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
  initialData,
  onSubmit,
  isEdit = false,
  onCancel
}) => {
  const { form, classes, teachers, isLoading } = useSessionForm({ initialData });

  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data);
    onSubmit(data);
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
