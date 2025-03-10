
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { StatsCardProps } from "@/lib/types";

const StatsCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  iconComponent,
  description,
  trend,
  className
}: StatsCardProps) => {
  // Get the icon component using a type assertion
  let IconComponent = null;
  if (icon && typeof icon === "string" && icon in LucideIcons) {
    IconComponent = (LucideIcons as any)[icon];
  }

  return (
    <div className={cn(
      "rounded-xl border bg-card p-6 transition-all hover:shadow-md animate-scale-in",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        
        {IconComponent && (
          <div className="rounded-full p-2 bg-primary/10">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
        )}
        
        {iconComponent && (
          <div className="rounded-full p-2 bg-primary/10">
            {iconComponent}
          </div>
        )}
      </div>
      
      {change !== undefined && (
        <div className="mt-4 flex items-center">
          {changeType === "increase" ? (
            <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
          ) : changeType === "decrease" ? (
            <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
          ) : (
            <MinusIcon className="mr-1 h-4 w-4 text-gray-500" />
          )}
          
          <p
            className={cn(
              "text-sm font-medium",
              changeType === "increase" && "text-green-500",
              changeType === "decrease" && "text-red-500", 
              changeType === "neutral" && "text-gray-500"
            )}
          >
            {change > 0 && "+"}
            {change}
            {changeType !== "neutral" && "%"}
            {" so với tháng trước"}
          </p>
        </div>
      )}
      
      {trend && (
        <div className="mt-4 flex items-center">
          {trend.direction === "up" ? (
            <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
          ) : trend.direction === "down" ? (
            <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
          ) : (
            <MinusIcon className="mr-1 h-4 w-4 text-gray-500" />
          )}
          
          <p
            className={cn(
              "text-sm font-medium",
              trend.direction === "up" && "text-green-500",
              trend.direction === "down" && "text-red-500", 
              trend.direction === "none" && "text-gray-500"
            )}
          >
            {trend.value} {trend.text}
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
