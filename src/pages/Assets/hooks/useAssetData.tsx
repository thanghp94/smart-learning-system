
import { useState, useEffect } from "react";
import { assetService } from "@/lib/supabase";
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
      const data = await assetService.getAll();
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

      return (facility ? matchesFacility : true) && (employee ? matchesEmployee : true);
    });

    setFilteredAssets(filtered);
  };

  const handleResetFilters = () => {
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
