
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import TableCard from "./TableCard";
import { SchemaInfo, TableInfo } from "../types";

interface RealSchemaTabProps {
  loading: boolean;
  schemaData: SchemaInfo[];
  tables: TableInfo[];
}

const RealSchemaTab = ({ loading, schemaData, tables }: RealSchemaTabProps) => {
  // Group tables by type (table vs view)
  const groupedTables = schemaData.reduce((acc, table) => {
    const isView = table.table_name.includes('_view') || 
                  table.table_name.includes('with_') || 
                  table.table_name.includes('_by_');
    
    if (isView) {
      acc.views.push(table);
    } else {
      acc.tables.push(table);
    }
    
    return acc;
  }, { tables: [] as SchemaInfo[], views: [] as SchemaInfo[] });

  if (loading) {
    return (
      <TabsContent value="real-schema">
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={`skeleton-${i}`} className="shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-5 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    );
  }

  if (schemaData.length === 0) {
    return (
      <TabsContent value="real-schema">
        <Card className="shadow-sm p-6 text-center">
          <p className="text-muted-foreground">
            No schema data found. Please make sure your Supabase database is properly configured 
            and the get_schema_info function is created.
          </p>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="real-schema">
      {groupedTables.views.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            Database Views
            <Badge variant="outline" className="ml-2">{groupedTables.views.length}</Badge>
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {groupedTables.views.map((view) => (
              <TableCard 
                key={view.table_name}
                name={view.table_name}
                purpose="Generated view for data analysis and reporting"
                columnCount={view.column_count}
                isView={true}
              />
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Database Tables
          <Badge variant="outline" className="ml-2">{groupedTables.tables.length}</Badge>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {schemaData.filter(t => 
            !t.table_name.includes('_view') && 
            !t.table_name.includes('with_') && 
            !t.table_name.includes('_by_')
          ).map((table) => (
            <TableCard 
              key={table.table_name}
              name={table.table_name}
              purpose={tables.find(t => t.name === table.table_name)?.purpose || 
                "Table from your Supabase database"}
              columnCount={table.column_count}
            />
          ))}
        </div>
      </div>
    </TabsContent>
  );
};

export default RealSchemaTab;
