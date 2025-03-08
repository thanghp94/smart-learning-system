
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Dynamically get icon component
  const getIconComponent = (iconName: string) => {
    const LucideIcon = (LucideIcons as Record<string, React.ComponentType<any>>)[iconName] || LucideIcons.CircleDot;
    return <LucideIcon size={20} />;
  };

  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2 px-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">S</span>
          </div>
          <div className="font-medium text-lg">Smart Learning</div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <nav className="grid gap-1 p-2">
          {NAVIGATION_ITEMS.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                currentPath === item.path && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
            >
              {getIconComponent(item.icon)}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex justify-center">
          <Button variant="outline" size="sm" className="w-full">
            <LucideIcons.LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
