
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TableCard from "./TableCard";
import { SchemaInfo, TableInfo } from "../types";

interface RealSchemaTabProps {
  loading: boolean;
  schemaData: SchemaInfo[];
  tables: TableInfo[];
}

const RealSchemaTab = ({ loading, schemaData, tables }: RealSchemaTabProps) => {
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
      <div className="grid md:grid-cols-2 gap-4">
        {schemaData.map((table) => (
          <TableCard 
            key={table.table_name}
            name={table.table_name}
            purpose={tables.find(t => t.name === table.table_name)?.purpose || 
              "Table from your Supabase database"}
            columnCount={table.column_count}
          />
        ))}
      </div>
    </TabsContent>
  );
};

export default RealSchemaTab;
