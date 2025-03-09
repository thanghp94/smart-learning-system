
import React from "react";
import { DollarSign } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Payroll = () => {
  return (
    <PlaceholderPage
      title="Lương"
      description="Quản lý bảng lương nhân viên"
      icon={<DollarSign className="h-16 w-16 text-muted-foreground/40" />}
    />
  );
};

export default Payroll;
