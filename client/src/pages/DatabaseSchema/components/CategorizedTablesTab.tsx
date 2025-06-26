
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TableCard from "./TableCard";
import { TableInfo, TableCategory } from "../types";

interface CategorizedTablesTabProps {
  tableCategories: TableCategory[];
}

const CategorizedTablesTab = ({ tableCategories }: CategorizedTablesTabProps) => {
  return (
    <TabsContent value="by-category">
      <div className="space-y-6">
        {tableCategories.map((category) => (
          <div key={category.key}>
            <h3 className="text-lg font-semibold mb-3">{category.name}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {category.tables.map((table) => (
                <TableCard 
                  key={table.key}
                  name={table.name}
                  vietnameseName={table.vietnameseName}
                  purpose={table.purpose}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </TabsContent>
  );
};

export default CategorizedTablesTab;
