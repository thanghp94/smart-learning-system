
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { sessionSchema } from "../schemas/sessionSchema";

interface SessionEvaluationFieldsProps {
  form: UseFormReturn<z.infer<typeof sessionSchema>>;
}

const SessionEvaluationFields = ({ form }: SessionEvaluationFieldsProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Đánh giá buổi học</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="nhan_xet_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đánh giá 1 (1-10)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.5" 
                  {...field} 
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
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
              <FormLabel>Đánh giá 2 (1-10)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.5" 
                  {...field} 
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
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
              <FormLabel>Đánh giá 3 (1-10)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.5" 
                  {...field} 
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
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
              <FormLabel>Đánh giá 4 (1-10)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.5" 
                  {...field} 
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
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
              <FormLabel>Đánh giá 5 (1-10)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.5" 
                  {...field} 
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
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
              <FormLabel>Đánh giá 6 (1-10)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.5" 
                  {...field} 
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-4">
        <FormField
          control={form.control}
          name="nhan_xet_chung"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhận xét chung</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SessionEvaluationFields;
