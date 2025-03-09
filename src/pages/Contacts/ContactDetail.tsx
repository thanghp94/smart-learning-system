
import React from "react";
import { Contact } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ContactDetailProps {
  contact: Contact;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{contact.ten_lien_he}</h2>
        <div className="flex items-center mt-2 space-x-2">
          <Badge variant="outline">{contact.phan_loai}</Badge>
          <Badge
            variant={
              contact.trang_thai === "active" ? "success" : 
              contact.trang_thai === "inactive" ? "destructive" : 
              "secondary"
            }
          >
            {contact.trang_thai === "active" ? "Hoạt động" : 
             contact.trang_thai === "inactive" ? "Không hoạt động" : 
             "Chờ xử lý"}
          </Badge>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Thông tin liên hệ</h3>
          
          <div className="space-y-2">
            {contact.email && (
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Email:</span>
                <span>{contact.email}</span>
              </div>
            )}
            
            {contact.sdt && (
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Số điện thoại:</span>
                <span>{contact.sdt}</span>
              </div>
            )}
            
            {contact.khu_vuc_dang_o && (
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Khu vực:</span>
                <span>{contact.khu_vuc_dang_o}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold">Thông tin khác</h3>
          
          <div className="space-y-2">
            {contact.ngay_sinh && (
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Ngày sinh:</span>
                <span>{formatDate(contact.ngay_sinh)}</span>
              </div>
            )}
            
            {contact.link_cv && (
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Link CV:</span>
                <a href={contact.link_cv} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">
                  {contact.link_cv}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {contact.mieu_ta && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Miêu tả</h3>
            <p className="whitespace-pre-line">{contact.mieu_ta}</p>
          </div>
        </>
      )}
      
      {contact.ghi_chu && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Ghi chú</h3>
            <p className="whitespace-pre-line">{contact.ghi_chu}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactDetail;
