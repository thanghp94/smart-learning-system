
import React, { useState, useEffect } from "react";
import { Calendar, Plus } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import EventForm from "./EventForm";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// This would need to be created/imported from a service file
// const eventService = {
//   getAll: () => [],
//   create: (data) => Promise.resolve(data)
// };

const Events = () => {
  const [events, setEvents] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  // Uncomment when the event service is available
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const data = await eventService.getAll();
  //       setEvents(data);
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //       toast({
  //         title: "Lỗi",
  //         description: "Không thể tải danh sách sự kiện",
  //         variant: "destructive",
  //       });
  //     }
  //   };
  //   fetchEvents();
  // }, [toast]);

  const handleAddEvent = async (data: any) => {
    console.log("Adding event:", data);
    // When the event service is available:
    // try {
    //   await eventService.create(data);
    //   toast({
    //     title: "Thành công",
    //     description: "Đã thêm sự kiện mới",
    //   });
    //   setShowDialog(false);
    //   // Refresh the events
    //   const updatedEvents = await eventService.getAll();
    //   setEvents(updatedEvents);
    // } catch (error) {
    //   console.error("Error adding event:", error);
    //   toast({
    //     title: "Lỗi",
    //     description: "Không thể thêm sự kiện mới",
    //     variant: "destructive",
    //   });
    // }
    
    // For now just show a toast and close the dialog
    toast({
      title: "Thông báo",
      description: "Chức năng đang được phát triển",
    });
    setShowDialog(false);
  };

  const handleAddClick = () => {
    setShowDialog(true);
  };

  const renderEventForm = () => {
    return <EventForm onSubmit={handleAddEvent} />;
  };

  return (
    <>
      <PlaceholderPage
        title="Sự Kiện"
        description="Quản lý các sự kiện trong hệ thống"
        icon={<Calendar className="h-16 w-16 text-muted-foreground/40" />}
        addButtonAction={handleAddClick}
      />
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm mới sự kiện</DialogTitle>
          </DialogHeader>
          {renderEventForm()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Events;
