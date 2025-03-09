
import React from "react";
import { FileText } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Files = () => {
  return (
    <PlaceholderPage
      title="Hồ Sơ"
      description="Quản lý hồ sơ tài liệu"
      icon={<FileText className="h-16 w-16 text-muted-foreground/40" />}
    />
  );
};

export default Files;
