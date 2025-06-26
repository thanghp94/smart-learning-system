
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  showValue = false,
  valueFormatter,
  label,
  variant = 'default',
  className,
}) => {
  const normalizedValue = Math.min(100, Math.max(0, (value / max) * 100));
  const formattedValue = valueFormatter ? valueFormatter(value) : `${Math.round(normalizedValue)}%`;
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };
  
  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showValue && <span className="font-medium">{formattedValue}</span>}
        </div>
      )}
      <Progress 
        value={normalizedValue} 
        className={sizeClasses[size]}
        indicatorClassName={variantClasses[variant]}
      />
    </div>
  );
};

export default ProgressBar;
