
import React from "react";
import { Settings as SettingsIcon } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Settings = () => {
  return (
    <PlaceholderPage
      title="Cài Đặt"
      description="Quản lý cài đặt hệ thống"
      icon={<SettingsIcon className="h-16 w-16 text-muted-foreground/40" />}
    />
  );
};

export default Settings;
