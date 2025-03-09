
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TableCard from "./TableCard";
import { TableInfo } from "../types";

interface AllTablesTabProps {
  tables: TableInfo[];
}

const AllTablesTab = ({ tables }: AllTablesTabProps) => {
  return (
    <TabsContent value="all-tables">
      <div className="grid md:grid-cols-2 gap-4">
        {tables.map((table) => (
          <TableCard 
            key={table.key} 
            name={table.name} 
            vietnameseName={table.vietnameseName} 
            purpose={table.purpose} 
          />
        ))}
      </div>
    </TabsContent>
  );
};

export default AllTablesTab;
