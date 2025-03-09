
import React from "react";
import { Phone } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Contacts = () => {
  return (
    <PlaceholderPage
      title="Liên Hệ"
      description="Quản lý danh sách liên hệ"
      icon={<Phone className="h-16 w-16 text-muted-foreground/40" />}
    />
  );
};

export default Contacts;
