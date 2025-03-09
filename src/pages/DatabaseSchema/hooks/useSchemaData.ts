
import { useState, useEffect } from "react";
import { getSchemaInfo, setupSchemaFunction } from "@/lib/supabase/schema-service";
import { supabase } from "@/lib/supabase";
import { SchemaInfo } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useSchemaData = () => {
  const [schemaData, setSchemaData] = useState<SchemaInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        // Check if Supabase is properly configured
        const isSupabaseConfigured = 
          import.meta.env.VITE_SUPABASE_URL && 
          import.meta.env.VITE_SUPABASE_ANON_KEY;
          
        if (!isSupabaseConfigured) {
          // Set some dummy data for preview purposes when Supabase isn't configured
          setSchemaData([
            { table_name: "students", column_count: 12 },
            { table_name: "classes", column_count: 8 },
            { table_name: "employees", column_count: 15 },
            { table_name: "assets", column_count: 10 },
            { table_name: "teaching_sessions", column_count: 7 }
          ]);
          
          console.log("Using sample data - Supabase not configured");
          toast({
            title: "Demo Mode",
            description: "Using sample data as Supabase is not configured",
            variant: "default",
          });
          setLoading(false);
          return;
        }
        
        // Setup schema function if not exists
        await setupSchemaFunction();
        
        // Fetch schema data
        const result = await getSchemaInfo();
        
        if (result.success && result.data) {
          setSchemaData(result.data);
        } else if (result.error) {
          console.error("Error fetching schema:", result.error);
          toast({
            title: "Error fetching schema",
            description: result.error.message,
            variant: "destructive",
          });
          
          // Fallback to metdata API if RPC fails
          try {
            const { data, error } = await supabase.from('pg_tables')
              .select('tablename')
              .eq('schemaname', 'public');
            
            if (error) {
              console.error("Fallback error:", error);
            } else if (data) {
              setSchemaData(data.map(t => ({ 
                table_name: t.tablename, 
                column_count: 0 
              })));
            }
          } catch (fallbackErr) {
            console.error("Fallback fetch error:", fallbackErr);
          }
        }
      } catch (err) {
        console.error("Error in schema fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, [toast]);

  return { schemaData, loading };
};
