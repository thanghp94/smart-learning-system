
import React from "react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TablePageLayout from "@/components/common/TablePageLayout";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  addButtonAction?: () => void;
  renderForm?: () => React.ReactNode;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  icon = <FileText className="h-16 w-16 text-muted-foreground/40" />,
  addButtonAction,
  renderForm,
}) => {
  const handleAddClick = () => {
    if (addButtonAction) {
      addButtonAction();
    }
  };

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm mới
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title={title}
      description={description}
      actions={tableActions}
    >
      <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-md bg-card/50">
        {icon}
        <h3 className="mt-4 text-xl font-medium text-muted-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground/70">{description}</p>
        <Button className="mt-6" size="sm" onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-1" /> Thêm mới {title.toLowerCase()}
        </Button>
      </div>
    </TablePageLayout>
  );
};

export default PlaceholderPage;
