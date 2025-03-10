
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { primaryLinks, secondaryLinks } from "./SidebarLinks";
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
        "border-r bg-card fixed inset-y-0 z-30 flex h-full flex-col transition-all duration-300",
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
        <nav className="flex flex-col gap-2 p-2">
          <div className="py-2">
            <div
              className={cn(
                "mb-2 px-4 text-xs font-semibold tracking-tight",
                expanded ? "block" : "hidden"
              )}
            >
              Quản lý Chính
            </div>
            <div className="flex flex-col gap-1">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex h-9 items-center rounded-md px-4 transition-colors",
                    pathname === link.href
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    !expanded && "justify-center px-2"
                  )}
                >
                  {link.icon}
                  {expanded && <span className="ml-2">{link.name}</span>}
                </Link>
              ))}
            </div>
          </div>

          <div className="py-2">
            <div
              className={cn(
                "mb-2 px-4 text-xs font-semibold tracking-tight",
                expanded ? "block" : "hidden"
              )}
            >
              Quản lý Khác
            </div>
            <div className="flex flex-col gap-1">
              {secondaryLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex h-9 items-center rounded-md px-4 transition-colors",
                    pathname === link.href
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    !expanded && "justify-center px-2"
                  )}
                >
                  {link.icon}
                  {expanded && <span className="ml-2">{link.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </ScrollArea>
    </div>
  );
}

export default Sidebar;
