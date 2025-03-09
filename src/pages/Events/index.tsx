
import React from "react";
import { Calendar } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Events = () => {
  return (
    <PlaceholderPage
      title="Sự Kiện"
      description="Quản lý các sự kiện trong hệ thống"
      icon={<Calendar className="h-16 w-16 text-muted-foreground/40" />}
    />
  );
};

export default Events;
