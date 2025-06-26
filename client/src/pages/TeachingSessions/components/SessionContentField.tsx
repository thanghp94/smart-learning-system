
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { sessionSchema } from "../schemas/sessionSchema";

interface SessionContentFieldProps {
  form: UseFormReturn<z.infer<typeof sessionSchema>>;
}

const SessionContentField = ({ form }: SessionContentFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="noi_dung"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nội dung buổi học</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Mô tả nội dung buổi học" 
              {...field} 
              rows={3}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SessionContentField;
