
import React from "react";
import { ClipboardList } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Enrollments = () => {
  return (
    <PlaceholderPage
      title="Ghi Danh"
      description="Quản lý danh sách ghi danh học sinh vào lớp học"
      icon={<ClipboardList className="h-16 w-16 text-muted-foreground/40" />}
    />
  );
};

export default Enrollments;
