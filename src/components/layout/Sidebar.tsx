
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";

// Define navigation categories to organize sidebar items
const NAVIGATION_CATEGORIES = [
  {
    title: "Dashboard",
    items: [
      { title: "Trang Chủ", path: "/", icon: "Home" }
    ]
  },
  {
    title: "Học Tập",
    items: [
      { title: "Học Sinh", path: "/students", icon: "GraduationCap" },
      { title: "Lớp Học", path: "/classes", icon: "BookOpen" },
      { title: "Buổi Học", path: "/teaching-sessions", icon: "CalendarDays" },
      { title: "Bài Học", path: "/sessions", icon: "FileText" },
      { title: "Ghi Danh", path: "/enrollments", icon: "ClipboardCheck" },
      { title: "Đánh Giá", path: "/evaluations", icon: "Star" }
    ]
  },
  {
    title: "Nhân Sự",
    items: [
      { title: "Nhân Viên", path: "/employees", icon: "Users" },
      { title: "Bảng Lương", path: "/payroll", icon: "Wallet" },
      { title: "Đề Xuất", path: "/requests", icon: "FileQuestion" }
    ]
  },
  {
    title: "Cơ Sở & Tài Sản",
    items: [
      { title: "Cơ Sở", path: "/facilities", icon: "Building" },
      { title: "Tài Sản", path: "/assets", icon: "Package" },
      { title: "Chuyển Tài Sản", path: "/assets/transfers", icon: "MoveRight" }
    ]
  },
  {
    title: "Quản Lý",
    items: [
      { title: "Sự Kiện", path: "/events", icon: "Calendar" },
      { title: "Công Việc", path: "/tasks", icon: "CheckSquare" },
      { title: "Tài Chính", path: "/finance", icon: "PiggyBank" },
      { title: "Hình Ảnh", path: "/images", icon: "Image" },
      { title: "Hồ Sơ", path: "/files", icon: "FolderArchive" },
      { title: "Liên Hệ", path: "/contacts", icon: "AddressBook" }
    ]
  },
  {
    title: "Hệ Thống",
    items: [
      { title: "Cài Đặt", path: "/settings", icon: "Settings" },
      { title: "Cơ Sở Dữ Liệu", path: "/database-schema", icon: "Database" }
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Dynamically get icon component with type assertion
  const getIconComponent = (iconName: string) => {
    if (iconName && typeof iconName === "string" && iconName in LucideIcons) {
      const Icon = (LucideIcons as any)[iconName];
      return <Icon size={18} />;
    }
    return <LucideIcons.CircleDot size={18} />;
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
      
      <SidebarContent className="pb-6">
        {NAVIGATION_CATEGORIES.map((category, index) => (
          <div key={index} className="mt-4 first:mt-2">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {category.title}
            </h3>
            <nav className="grid gap-1 px-2">
              {category.items.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm",
                    currentPath === item.path && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )}
                >
                  {getIconComponent(item.icon)}
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        ))}
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
