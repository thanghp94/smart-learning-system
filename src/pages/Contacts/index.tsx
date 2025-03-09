import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { contactService } from "@/lib/supabase";
import { Contact } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import ContactDetail from "./ContactDetail";
import ContactForm from "./ContactForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách liên hệ",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<Contact>) => {
    try {
      const formattedData = {
        ...formData,
        ngay_sinh: formData.ngay_sinh ? new Date(formData.ngay_sinh).toISOString().split('T')[0] : null,
      };

      const newContact = await contactService.create(formattedData);
      setContacts([...contacts, newContact]);
      toast({
        title: "Thành công",
        description: "Thêm liên hệ mới thành công",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding contact:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm liên hệ mới",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
      return '';
    }
  };

  const columns = [
    {
      title: "Tên Liên Hệ",
      key: "ten_lien_he",
      sortable: true,
    },
    {
      title: "Phân Loại",
      key: "phan_loai",
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      title: "Email",
      key: "email",
      sortable: true,
    },
    {
      title: "Số Điện Thoại",
      key: "sdt",
    },
    {
      title: "Khu Vực",
      key: "khu_vuc_dang_o",
    },
    {
      title: "Trạng Thái",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => (
        <Badge 
          variant={
            value === "active" ? "success" : 
            value === "inactive" ? "destructive" : 
            "secondary"
          }
        >
          {value === "active" ? "Hoạt động" : 
           value === "inactive" ? "Không hoạt động" : 
           "Chờ xử lý"}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchContacts}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Liên Hệ
      </Button>
    </div>
  );

  if (contacts.length === 0 && !isLoading) {
    return (
      <>
        <PlaceholderPage
          title="Liên Hệ"
          description="Quản lý danh sách liên hệ"
          icon={<Phone className="h-16 w-16 text-muted-foreground/40" />}
          addButtonAction={handleAddClick}
        />
        
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm Liên Hệ Mới</DialogTitle>
            </DialogHeader>
            <ContactForm 
              onSubmit={handleAddFormSubmit}
              onCancel={handleAddFormCancel}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <TablePageLayout
        title="Liên Hệ"
        description="Quản lý danh sách liên hệ"
        actions={tableActions}
      >
        <DataTable
          columns={columns}
          data={contacts}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          searchable={true}
          searchPlaceholder="Tìm kiếm liên hệ..."
        />
      </TablePageLayout>

      {selectedContact && (
        <DetailPanel
          title="Thông Tin Liên Hệ"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <ContactDetail contact={selectedContact} />
        </DetailPanel>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Liên Hệ Mới</DialogTitle>
          </DialogHeader>
          <ContactForm 
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Contacts;
