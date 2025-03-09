
import React from "react";
import { FileText } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import FileForm from "./FileForm";

const Files = () => {
  const handleAddFile = (data: any) => {
    console.log("Adding file:", data);
    // Here you would call the service to add the file
    // fileService.create(data).then(() => {
    //   // Handle success, refresh data, etc.
    // });
  };

  const renderFileForm = () => {
    return <FileForm onSubmit={handleAddFile} />;
  };

  return (
    <PlaceholderPage
      title="Hồ Sơ"
      description="Quản lý hồ sơ tài liệu"
      icon={<FileText className="h-16 w-16 text-muted-foreground/40" />}
      renderForm={renderFileForm}
    />
  );
};

export default Files;
