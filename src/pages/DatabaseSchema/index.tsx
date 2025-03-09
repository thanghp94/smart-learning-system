
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TablePageLayout from "@/components/common/TablePageLayout";
import { useSchemaData } from "./hooks/useSchemaData";
import { tables, views, tableCategories } from "./data/tableDefinitions";

// Component imports
import AllTablesTab from "./components/AllTablesTab";
import CategorizedTablesTab from "./components/CategorizedTablesTab";
import ViewsTab from "./components/ViewsTab";
import RealSchemaTab from "./components/RealSchemaTab";

const DatabaseSchema = () => {
  const { schemaData, loading } = useSchemaData();
  const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <TablePageLayout
      title="Cơ Sở Dữ Liệu"
      description="Danh sách các bảng dữ liệu và mục đích sử dụng của chúng trong hệ thống"
    >
      {isDemoMode && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          Demo mode active - showing sample schema data. Configure Supabase to see actual database schema.
        </div>
      )}
      
      <Tabs defaultValue="all-tables" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all-tables">Tất Cả Bảng</TabsTrigger>
          <TabsTrigger value="by-category">Theo Danh Mục</TabsTrigger>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="real-schema">Cấu Trúc Thực</TabsTrigger>
        </TabsList>

        {/* Tabs content */}
        <AllTablesTab tables={tables} />
        <CategorizedTablesTab tableCategories={tableCategories} />
        <ViewsTab views={views} />
        <RealSchemaTab 
          loading={loading} 
          schemaData={schemaData} 
          tables={tables} 
        />
      </Tabs>
    </TablePageLayout>
  );
};

export default DatabaseSchema;
