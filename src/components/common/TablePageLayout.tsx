
import React, { ReactNode } from "react";
import PageHeader from "@/components/common/PageHeader";

interface TablePageLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
  filters?: ReactNode;
}

const TablePageLayout = ({
  title,
  description,
  children,
  actions,
  filters
}: TablePageLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title={title} description={description} rightContent={actions} />
      
      {filters && (
        <div className="mb-4">
          {filters}
        </div>
      )}
      
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};

export default TablePageLayout;
