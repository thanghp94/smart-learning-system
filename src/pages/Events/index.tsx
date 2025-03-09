
import React from "react";
import { Calendar } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import EventForm from "./EventForm";

const Events = () => {
  const handleAddEvent = (data: any) => {
    console.log("Adding event:", data);
    // Here you would call the service to add the event
    // eventService.create(data).then(() => {
    //   // Handle success, refresh data, etc.
    // });
  };

  const renderEventForm = () => {
    return <EventForm onSubmit={handleAddEvent} />;
  };

  return (
    <PlaceholderPage
      title="Sự Kiện"
      description="Quản lý các sự kiện trong hệ thống"
      icon={<Calendar className="h-16 w-16 text-muted-foreground/40" />}
      renderForm={renderEventForm}
    />
  );
};

export default Events;
