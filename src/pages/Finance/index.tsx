
import React from "react";
import { CreditCard } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import FinanceForm from "./FinanceForm";

const Finance = () => {
  const handleAddFinance = (data: any) => {
    console.log("Adding finance entry:", data);
    // Here you would call the service to add the finance entry
    // financeService.create(data).then(() => {
    //   // Handle success, refresh data, etc.
    // });
  };

  const renderFinanceForm = () => {
    return <FinanceForm onSubmit={handleAddFinance} />;
  };

  return (
    <PlaceholderPage
      title="Tài Chính"
      description="Quản lý thu chi tài chính"
      icon={<CreditCard className="h-16 w-16 text-muted-foreground/40" />}
      renderForm={renderFinanceForm}
    />
  );
};

export default Finance;
