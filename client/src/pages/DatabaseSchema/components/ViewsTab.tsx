
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TableCard from "./TableCard";
import { ViewInfo } from "../types";

interface ViewsTabProps {
  views: ViewInfo[];
}

const ViewsTab = ({ views }: ViewsTabProps) => {
  return (
    <TabsContent value="views">
      <div className="grid md:grid-cols-2 gap-4">
        {views.map((view) => (
          <TableCard 
            key={view.key}
            name={view.name}
            purpose={view.purpose}
          />
        ))}
      </div>
    </TabsContent>
  );
};

export default ViewsTab;
