import React from "react";
import SidebarLinks from "./SidebarLinks";
import { CommandInterface } from "@/components/CommandInterface";

const Sidebar = () => {
  return (
    <aside className="h-screen flex flex-col border-r bg-background overflow-hidden">
      <div className="p-3 border-b">
        <img 
          src="/logo.svg" 
          alt="Logo" 
          className="h-8 mx-auto" 
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg'; 
            e.currentTarget.onerror = null;
          }} 
        />
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <SidebarLinks />
      </div>
      
      {/* Add the command interface to the sidebar */}
      <div className="mt-auto border-t pt-2">
        <CommandInterface />
      </div>
    </aside>
  );
};

export default Sidebar;
