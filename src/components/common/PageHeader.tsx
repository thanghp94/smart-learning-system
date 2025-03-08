
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
  className?: string;
  extras?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
}

const PageHeader = ({
  title,
  description,
  action,
  children,
  className,
  extras
}: PageHeaderProps) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {children}
          
          {action && (
            <Button onClick={action.onClick}>
              <Plus className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          )}
          
          {extras && extras.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {extras.map((item, index) => (
                  <DropdownMenuItem key={index} onClick={item.onClick}>
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
