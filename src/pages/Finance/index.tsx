
import React from "react";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import FinancePageContent from "./components/FinancePageContent";

const FinancePage = () => {
  const { toast } = useToast();

  return (
    <>
      <TablePageLayout
        title="Tài Chính"
        description="Quản lý thu chi và giao dịch tài chính"
      >
        <FinancePageContent />
      </TablePageLayout>
    </>
  );
};

export default FinancePage;
