
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
          
          // Fallback to metadata API if RPC fails
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
