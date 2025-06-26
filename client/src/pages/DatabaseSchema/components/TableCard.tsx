
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, View } from "lucide-react";

interface TableCardProps {
  name: string;
  purpose: string;
  vietnameseName?: string;
  columnCount?: number;
  isView?: boolean;
}

const TableCard = ({ 
  name, 
  purpose, 
  vietnameseName, 
  columnCount,
  isView = false
}: TableCardProps) => {
  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center">
            {isView ? (
              <View className="h-4 w-4 mr-2 text-blue-500" />
            ) : (
              <Database className="h-4 w-4 mr-2 text-primary" />
            )}
            <span className="font-mono">{name}</span>
          </div>
          {vietnameseName && (
            <Badge variant="outline" className="ml-2">
              {vietnameseName}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{purpose}</p>
        {columnCount && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {columnCount} columns
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TableCard;
