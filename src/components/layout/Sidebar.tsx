
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import SidebarLinks, { primaryLinks, secondaryLinks } from "./SidebarLinks";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={cn(
        "h-full border-r bg-card flex flex-col transition-all duration-300",
        expanded ? "w-64" : "w-[60px]"
      )}
    >
      <div className="border-b px-3 py-2 h-[57px] flex items-center justify-between">
        {expanded ? (
          <Link to="/" className="flex items-center">
            <span className="text-lg font-bold">Admin Dashboard</span>
          </Link>
        ) : (
          <span className="mx-auto">
            <Home className="h-5 w-5" />
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={toggleSidebar}
        >
          {expanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <SidebarLinks />
      </ScrollArea>
    </div>
  );
}

export default Sidebar;
