
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string | number;
  loading?: boolean;
  className?: string;
  valueClassName?: string;
  iconClassName?: string;
  onClick?: () => void;
}

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  trendValue, 
  loading = false,
  className = '',
  valueClassName = '',
  iconClassName = '',
  onClick
}: StatsCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden", 
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className={cn("h-4 w-4 text-muted-foreground", iconClassName)} />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-7 w-3/4 bg-muted animate-pulse rounded-md" />
        ) : (
          <div className={cn("text-2xl font-bold", valueClassName)}>
            {value}
          </div>
        )}
      </CardContent>
      {(description || trend) && (
        <CardFooter className="pt-0">
          {loading ? (
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md" />
          ) : (
            <div className="flex items-center text-xs text-muted-foreground">
              {trend && (
                <span 
                  className={cn(
                    "mr-1",
                    trend === 'up' && "text-green-500",
                    trend === 'down' && "text-red-500"
                  )}
                >
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''}
                  {trendValue && ` ${trendValue}`}
                </span>
              )}
              {description}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default StatsCard;
