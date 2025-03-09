
import React from "react";
import { CheckSquare } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Tasks = () => {
  return (
    <PlaceholderPage
      title="Công Việc"
      description="Quản lý danh sách công việc cần làm"
      icon={<CheckSquare className="h-16 w-16 text-muted-foreground/40" />}
    />
  );
};

export default Tasks;
