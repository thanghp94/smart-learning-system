
import React from "react";
import { CreditCard } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Finance = () => {
  return (
    <PlaceholderPage
      title="Tài Chính"
      description="Quản lý thu chi tài chính"
      icon={<CreditCard className="h-16 w-16 text-muted-foreground/40" />}
    />
  );
};

export default Finance;
