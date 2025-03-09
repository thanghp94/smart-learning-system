
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import { Bell, Sun, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  
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
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg bg-accent/80 backdrop-blur-sm px-3 w-72 h-10">
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
              <Avatar className="ml-4 cursor-pointer">
                <AvatarImage src="" />
                <AvatarFallback className="text-primary-foreground bg-primary">AD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="container mx-auto p-6 flex-1">
            {/* This will render the current route component */}
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
