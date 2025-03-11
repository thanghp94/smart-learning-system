
import * as React from "react"
import { cn } from "@/lib/utils"
import CommandInterface from "@/components/CommandInterface"
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "./sidebar-group"
import { useSidebar } from "./provider"

export const SidebarCommandGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  if (isCollapsed) {
    return null;
  }
  
  return (
    <SidebarGroup className={cn("mt-auto", className)} {...props} ref={ref}>
      <SidebarGroupLabel>AI Assistant</SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="p-2">
          <CommandInterface />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
})
SidebarCommandGroup.displayName = "SidebarCommandGroup"
