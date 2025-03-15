
import React from "react";
import { Image } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TableThumbnailProps } from "./types";

const TableThumbnail: React.FC<TableThumbnailProps> = ({ imageUrl, label }) => (
  <div className="flex items-center">
    <Avatar className="h-8 w-8 mr-3">
      <AvatarImage src={imageUrl} alt={label || "Thumbnail"} />
      <AvatarFallback>
        <Image className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
    <span>{label || "N/A"}</span>
  </div>
);

export default TableThumbnail;
