import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { fileService } from "@/lib/supabase";
import { File as FileDocument } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import FileForm from "./FileForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { FileFormValues } from "./schemas/fileSchema";

const FilesPage = () => {
  const [files, setFiles] = useState<FileDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const data = await fileService.getAll();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách hồ sơ",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: FileFormValues) => {
    try {
      console.log("Submitting file data:", formData);

      const formattedData: Partial<FileDocument> = {
        ten_tai_lieu: formData.ten_tai_lieu,
        doi_tuong_lien_quan: formData.loai_doi_tuong,
        nhom_tai_lieu: formData.nhom_tai_lieu,
        file1: formData.duong_dan,
        ngay_cap: formData.ngay_cap || null,
        han_tai_lieu: formData.han_tai_lieu || null,
        ghi_chu: formData.ghi_chu,
        trang_thai: formData.trang_thai || 'active'
      };

      switch(formData.loai_doi_tuong) {
        case 'nhan_vien':
        case 'employee':
          formattedData.nhan_vien_ID = formData.doi_tuong_id;
          break;
        case 'lien_he':
        case 'contact':
          formattedData.lien_he_id = formData.doi_tuong_id;
          break;
        case 'co_so':
        case 'facility':
          formattedData.co_so_id = formData.doi_tuong_id;
          break;
        case 'CSVC':
        case 'asset':
          formattedData.CSVC_ID = formData.doi_tuong_id;
          break;
        case 'class':
        case 'hoc_sinh':
          formattedData.hoc_sinh_id = formData.doi_tuong_id;
          break;
      }

      console.log("Formatted data for submission:", formattedData);
      await fileService.create(formattedData);
      
      toast({
        title: "Thành công",
        description: "Thêm hồ sơ mới thành công",
      });
      setShowAddForm(false);
      fetchFiles();
    } catch (error) {
      console.error("Error adding file:", error);
      console.error("Error details:", (error as any).details || error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm hồ sơ mới. " + ((error as Error).message || "Kiểm tra lại kết nối với database."),
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Tên tài liệu",
      key: "ten_tai_lieu",
      sortable: true,
    },
    {
      title: "Đối tượng liên quan",
      key: "doi_tuong_lien_quan",
      sortable: true,
      render: (value: string) => {
        const displayNames: { [key: string]: string } = {
          'nhan_vien': 'Nhân viên',
          'hoc_sinh': 'Học sinh',
          'co_so': 'Cơ sở',
          'CSVC': 'Tài sản',
          'lien_he': 'Liên hệ'
        };
        return displayNames[value] || value;
      }
    },
    {
      title: "Nhóm tài liệu",
      key: "nhom_tai_lieu",
      sortable: true,
    },
    {
      title: "Ngày cấp",
      key: "ngay_cap",
      sortable: true,
      render: (value: string) => value ? formatDate(value) : 'N/A',
    },
    {
      title: "Hạn tài liệu",
      key: "han_tai_lieu",
      sortable: true,
      render: (value: string) => value ? formatDate(value) : 'N/A',
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "destructive"}>
          {value === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchFiles}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm hồ sơ
      </Button>
    </div>
  );

  if (files.length === 0 && !isLoading) {
    return (
      <PlaceholderPage
        title="Hồ Sơ"
        description="Quản lý hồ sơ và tài liệu"
        icon={<File className="h-16 w-16 text-muted-foreground/40" />}
        addButtonAction={handleAddClick}
      />
    );
  }

  return (
    <>
      <TablePageLayout
        title="Hồ Sơ"
        description="Quản lý hồ sơ và tài liệu"
        actions={tableActions}
      >
        <DataTable
          columns={columns}
          data={files}
          isLoading={isLoading}
          searchable={true}
          searchPlaceholder="Tìm kiếm hồ sơ..."
        />
      </TablePageLayout>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Hồ Sơ Mới</DialogTitle>
            <DialogDescription>
              Điền thông tin hồ sơ mới và nhấn lưu để tạo hồ sơ.
            </DialogDescription>
          </DialogHeader>
          <FileForm 
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilesPage;
