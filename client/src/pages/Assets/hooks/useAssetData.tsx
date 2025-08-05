import { useState, useEffect } from "react";
import { assetService } from "@/lib/database";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useAssetData() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching assets...");
      const data = await assetService.getAssets();
      console.log("Assets loaded:", data?.length || 0);
      setAssets(data);
      setFilteredAssets(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tài sản",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleFilterChange = ({ facility, employee }: { facility?: string, employee?: string }) => {
    console.log("Filtering assets by:", { facility, employee });
    
    if (!facility && !employee) {
      setFilteredAssets(assets);
      return;
    }

    const filtered = assets.filter(asset => {
      let matchesFacility = true;
      let matchesEmployee = true;

      if (facility) {
        matchesFacility = asset.doi_tuong === 'facility' && asset.doi_tuong_id === facility;
      }

      if (employee) {
        matchesEmployee = asset.doi_tuong === 'employee' && asset.doi_tuong_id === employee;
      }

      if (facility && employee) {
        return matchesFacility || matchesEmployee;
      }
      
      return (facility ? matchesFacility : true) && (employee ? matchesEmployee : true);
    });

    console.log("Filtered assets:", filtered.length);
    setFilteredAssets(filtered);
  };

  const handleResetFilters = () => {
    console.log("Resetting asset filters");
    setFilteredAssets(assets);
  };

  return {
    assets,
    filteredAssets,
    isLoading,
    fetchAssets,
    handleFilterChange,
    handleResetFilters
  };
}
