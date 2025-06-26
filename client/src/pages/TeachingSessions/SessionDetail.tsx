
import React, { useState, useEffect } from "react";
import { TeachingSession } from "@/lib/types";
import { teachingSessionService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import SessionDetailComponent from "./components/SessionDetail";

interface SessionDetailProps {
  session: TeachingSession;
  class?: any;
  teacher?: any;
}

const SessionDetail = ({ session }: SessionDetailProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSessionUpdate = async (updatedSession: Partial<TeachingSession>) => {
    try {
      setIsLoading(true);
      await teachingSessionService.update(session.id, updatedSession);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin buổi học",
      });
    } catch (error) {
      console.error("Error updating session:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin buổi học",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  return (
    <SessionDetailComponent 
      session={session} 
      onSave={handleSessionUpdate} 
    />
  );
};

export default SessionDetail;
