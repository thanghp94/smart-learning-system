
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, User, MapPin, Book, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { TeachingSession } from '@/lib/types';

interface TodayClassesListProps {
  sessions: TeachingSession[];
  isLoading?: boolean;
}

const TodayClassesList: React.FC<TodayClassesListProps> = ({ 
  sessions = [], 
  isLoading = false 
}) => {
  const navigate = useNavigate();
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const toggleSessionDetails = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  const handleViewDetails = (sessionId: string) => {
    navigate(`/teaching-sessions/${sessionId}`);
  };

  // Format time from 24-hour format (HH:MM) to 12-hour format (hh:mm AM/PM)
  const formatTime = (time: string | undefined) => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hoursInt = parseInt(hours, 10);
    const ampm = hoursInt >= 12 ? 'PM' : 'AM';
    const hoursFormatted = hoursInt % 12 || 12;
    
    return `${hoursFormatted}:${minutes} ${ampm}`;
  };

  // Calculate session status based on current time and session time
  const getSessionStatus = (session: TeachingSession) => {
    if (!session.thoi_gian_bat_dau || !session.thoi_gian_ket_thuc) {
      return 'upcoming';
    }
    
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    const [startHours, startMinutes] = session.thoi_gian_bat_dau.split(':').map(Number);
    const [endHours, endMinutes] = session.thoi_gian_ket_thuc.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    
    if (currentTotalMinutes < startTotalMinutes) {
      return 'upcoming';
    } else if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes) {
      return 'ongoing';
    } else {
      return 'completed';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Lịch dạy hôm nay</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">Không có lịch dạy hôm nay</div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const status = getSessionStatus(session);
              const isExpanded = expandedSessionId === session.id;
              
              return (
                <div 
                  key={session.id} 
                  className={cn(
                    "border rounded-md overflow-hidden",
                    status === 'ongoing' && "border-blue-400",
                    status === 'completed' && "border-gray-300 bg-gray-50"
                  )}
                >
                  <div 
                    className="p-3 cursor-pointer flex items-center justify-between"
                    onClick={() => toggleSessionDetails(session.id)}
                  >
                    <div className="space-y-1">
                      <div className="font-medium">
                        {session.classes?.ten_lop_full || 'Lớp chưa xác định'}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
                        
                        <Badge 
                          className={cn(
                            "ml-2",
                            status === 'upcoming' && "bg-amber-500",
                            status === 'ongoing' && "bg-blue-500",
                            status === 'completed' && "bg-gray-500"
                          )}
                          variant="secondary"
                        >
                          {status === 'upcoming' ? 'Sắp diễn ra' : 
                           status === 'ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      isExpanded && "rotate-90"
                    )} />
                  </div>
                  
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 space-y-2">
                      <Separator />
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div className="flex items-center text-muted-foreground">
                          <User className="h-3.5 w-3.5 mr-1" />
                          <span>Trợ giảng:</span>
                        </div>
                        <div>{session.assistant_name || session.tro_giang || 'Không có'}</div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>Phòng:</span>
                        </div>
                        <div>{session.phong_hoc_id || 'Chưa phân phòng'}</div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <Book className="h-3.5 w-3.5 mr-1" />
                          <span>Buổi số:</span>
                        </div>
                        <div>{session.session_id || session.buoi_hoc_so || 'N/A'}</div>
                      </div>
                      
                      {session.noi_dung && (
                        <div className="text-sm mt-2">
                          <div className="text-muted-foreground font-medium mb-1">Nội dung:</div>
                          <div className="text-sm">{session.noi_dung}</div>
                        </div>
                      )}
                      
                      <Button 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => handleViewDetails(session.id)}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayClassesList;
