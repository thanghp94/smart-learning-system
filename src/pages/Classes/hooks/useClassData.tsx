
import { useState, useEffect } from "react";
import { classService } from "@/lib/supabase";
import { Class } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useClassData() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching classes...");
      const data = await classService.getAll();
      console.log("Classes data received:", data);
      
      if (data && Array.isArray(data)) {
        setClasses(data as unknown as Class[]);
        setFilteredClasses(data as unknown as Class[]);
        console.log("Classes set to state:", data.length);
      } else {
        console.error("Invalid classes data:", data);
        setClasses([]);
        setFilteredClasses([]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách lớp học",
        variant: "destructive"
      });
      setClasses([]);
      setFilteredClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleFilterChange = ({ facility, program }: { facility?: string, program?: string }) => {
    if (!facility && !program) {
      setFilteredClasses(classes);
      return;
    }

    const filtered = classes.filter(cls => {
      let matchesFacility = true;
      let matchesProgram = true;

      if (facility) {
        matchesFacility = cls.co_so === facility;
      }

      if (program) {
        matchesProgram = cls.ct_hoc === program;
      }

      return matchesFacility && matchesProgram;
    });

    setFilteredClasses(filtered);
  };

  const handleResetFilters = () => {
    setFilteredClasses(classes);
  };

  return {
    classes,
    filteredClasses, 
    isLoading,
    fetchClasses,
    handleFilterChange,
    handleResetFilters
  };
}
