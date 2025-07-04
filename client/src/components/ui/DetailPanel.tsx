
import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DetailPanelProps {
  title: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  footerContent?: React.ReactNode;
  className?: string;
  items?: Array<{ label: string; value: string | React.ReactNode }>;
}

const DetailPanel = ({
  title,
  children,
  isOpen = true,
  onClose,
  footerContent,
  className,
  items
}: DetailPanelProps) => {
  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] lg:w-[600px] border-l bg-background shadow-xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="custom-scrollbar overflow-y-auto p-6" style={{ height: footerContent ? "calc(100vh - 16rem)" : "calc(100vh - 8rem)" }}>
        {items && (
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
      
      {footerContent && (
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-sm p-4">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default DetailPanel;
