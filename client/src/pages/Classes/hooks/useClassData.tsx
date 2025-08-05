
import { useState, useEffect } from "react";
import { classService } from "@/lib/database";
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
      
      // Using the service method to get all classes
      const data = await classService.getClasses();
      console.log("Classes data received:", data);
      
      if (data && Array.isArray(data)) {
        // Ensure all class objects have required properties
        const processedClasses = data.map((cls: any) => ({
          ...cls,
          id: cls.id || crypto.randomUUID(),
          ten_lop_full: cls.ten_lop_full || cls.Ten_lop_full || '',
          ten_lop: cls.ten_lop || '',
          ct_hoc: cls.ct_hoc || '',
          co_so: cls.co_so || '',
          gv_chinh: cls.gv_chinh || cls.GV_chinh || '',
          ngay_bat_dau: cls.ngay_bat_dau || null,
          tinh_trang: cls.tinh_trang || 'pending'
        }));
        
        setClasses(processedClasses);
        setFilteredClasses(processedClasses);
        console.log("Classes set to state:", processedClasses.length);
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
