
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { facilityService } from "@/lib/supabase";
import { Facility } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import FacilityDetail from "./FacilityDetail";

const Facilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setIsLoading(true);
      const data = await facilityService.getAll();
      setFacilities(data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách cơ sở",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const columns = [
    {
      title: "Tên cơ sở",
      key: "ten_co_so",
      sortable: true,
    },
    {
      title: "Loại cơ sở",
      key: "loai_co_so",
      sortable: true,
    },
    {
      title: "Địa chỉ",
      key: "dia_chi_co_so",
    },
    {
      title: "Số điện thoại",
      key: "phone",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "destructive"}>
          {value === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8">
        <Plus className="h-4 w-4 mr-1" /> Thêm Cơ Sở
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Cơ Sở"
      description="Quản lý thông tin cơ sở trong hệ thống"
      actions={tableActions}
    >
      <DataTable
        columns={columns}
        data={facilities}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm cơ sở..."
      />

      {selectedFacility && (
        <DetailPanel
          title="Thông Tin Cơ Sở"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <FacilityDetail facility={selectedFacility} />
        </DetailPanel>
      )}
    </TablePageLayout>
  );
};

export default Facilities;
