
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchBarProps } from "./types";

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  setCurrentPage, 
  searchPlaceholder 
}) => (
  <div className="flex w-full items-center space-x-2 mb-4">
    <Search className="h-4 w-4 text-muted-foreground ml-2" />
    <Input
      placeholder={searchPlaceholder}
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
      }}
      className="w-full h-9 pl-8 -ml-6"
    />
  </div>
);

export default SearchBar;
