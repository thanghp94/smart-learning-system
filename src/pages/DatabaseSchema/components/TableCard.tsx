
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TableCardProps {
  name: string;
  vietnameseName?: string;
  purpose: string;
  columnCount?: number;
}

const TableCard = ({ name, vietnameseName, purpose, columnCount }: TableCardProps) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between">
          <span className="font-bold text-primary">{name}</span>
          {vietnameseName && (
            <span className="text-muted-foreground text-sm">{vietnameseName}</span>
          )}
          {columnCount !== undefined && (
            <span className="text-muted-foreground text-sm">{columnCount} columns</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{purpose}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default TableCard;
