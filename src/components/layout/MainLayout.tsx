
import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import { Bell, Sun, Moon, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MainLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleNotificationClick = () => {
    toast({
      title: "Thông báo",
      description: "Không có thông báo mới",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {!isMobile && <Sidebar />}
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border animate-fade-in">
            <div className="flex items-center gap-2">
              {isMobile && (
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0">
                    <Sidebar />
                  </SheetContent>
                </Sheet>
              )}
              
              <div className="flex items-center rounded-lg bg-accent/80 backdrop-blur-sm px-3 w-full max-w-[200px] md:max-w-[280px] h-10">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..."
                  className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              <Button size="icon" variant="ghost" onClick={handleNotificationClick}>
                <Bell size={20} />
              </Button>
              <Avatar className="ml-2 cursor-pointer">
                <AvatarImage src="" />
                <AvatarFallback className="text-primary-foreground bg-primary">AD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 flex-1 max-w-full overflow-x-hidden">
            {/* This will render the current route component */}
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
