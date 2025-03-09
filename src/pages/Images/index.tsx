
import React from "react";
import { Image } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Images = () => {
  return (
    <PlaceholderPage
      title="Hình Ảnh"
      description="Quản lý kho hình ảnh trong hệ thống"
      icon={<Image className="h-16 w-16 text-muted-foreground/40" />}
    />
  );
};

export default Images;
