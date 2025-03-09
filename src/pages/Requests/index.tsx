
import React from "react";
import { FileSignature } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Requests = () => {
  return (
    <PlaceholderPage
      title="Đề Xuất"
      description="Quản lý các đề xuất xin phép"
      icon={<FileSignature className="h-16 w-16 text-muted-foreground/40" />}
    />
  );
};

export default Requests;
