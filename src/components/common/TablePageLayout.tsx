
import React, { ReactNode } from "react";
import PageHeader from "@/components/common/PageHeader";

interface TablePageLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}

const TablePageLayout = ({
  title,
  description,
  children,
  actions
}: TablePageLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title={title} description={description} children={actions} />
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};

export default TablePageLayout;
