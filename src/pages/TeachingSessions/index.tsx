
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { TeachingSession } from '@/lib/types';
import { teachingSessionService } from '@/lib/supabase/teaching-session-service';
import { attendanceService } from '@/lib/supabase/attendance-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { TablePageLayout } from '@/components/common/TablePageLayout';
import { DatePicker } from '@/components/ui/DatePicker';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Flag, Plus, RefreshCw, UserCheck } from 'lucide-react';

const TeachingSessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isGeneratingAttendance, setIsGeneratingAttendance] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchSessionsByDate(selectedDate);
  }, [selectedDate]);

  const fetchSessionsByDate = async (date: Date) => {
    setIsLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const data = await teachingSessionService.getByDateRange(formattedDate, formattedDate);
      setSessions(data);
    } catch (error) {
      console.error('Error fetching teaching sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch teaching sessions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSession = () => {
    navigate('/teaching-sessions/new');
  };
  
  const handleGenerateAttendance = async () => {
    setIsGeneratingAttendance(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const result = await attendanceService.generateForDate(formattedDate);
      
      toast({
        title: 'Attendance Records Generated',
        description: `Created ${result.created} new records. ${result.skipped} records already existed.`,
        variant: result.created > 0 ? 'default' : 'secondary',
      });
    } catch (error) {
      console.error('Error generating attendance records:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate attendance records. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingAttendance(false);
    }
  };

  const handleRowClick = (session: TeachingSession) => {
    navigate(`/teaching-sessions/${session.id}`);
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    
    // Ensure time is in the format HH:MM:SS
    if (time.includes('T')) {
      // This is a full datetime string, extract just the time part
      const date = new Date(time);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Simple time string processing
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const columns = [
    {
      title: 'Date',
      key: 'ngay_hoc',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {value ? format(new Date(value), 'dd/MM/yyyy') : ''}
        </div>
      ),
    },
    {
      title: 'Class',
      key: 'lop_chi_tiet_id',
      sortable: true,
    },
    {
      title: 'Start Time',
      key: 'thoi_gian_bat_dau',
      sortable: true,
      render: (value: string) => formatTime(value),
    },
    {
      title: 'End Time',
      key: 'thoi_gian_ket_thuc',
      sortable: true,
      render: (value: string) => formatTime(value),
    },
    {
      title: 'Teacher',
      key: 'giao_vien',
      sortable: true,
    },
    {
      title: 'Status',
      key: 'status',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-muted-foreground" />
          {value || 'Scheduled'}
        </div>
      ),
    },
  ];

  return (
    <TablePageLayout>
      <PageHeader 
        title="Teaching Sessions" 
        description="Manage teaching sessions and attendance"
        buttons={[
          <DatePicker 
            key="date-picker"
            date={selectedDate} 
            onSelect={setSelectedDate}
            className="mr-2"
          />,
          <Button 
            key="generate-attendance"
            variant="outline"
            onClick={handleGenerateAttendance}
            disabled={isGeneratingAttendance || sessions.length === 0}
            className="mr-2"
          >
            {isGeneratingAttendance ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Generate Attendance
              </>
            )}
          </Button>,
          <Button key="add-session" onClick={handleAddSession}>
            <Plus className="mr-2 h-4 w-4" />
            Add Session
          </Button>,
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            {format(selectedDate, 'PPP')} Teaching Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={sessions}
            isLoading={isLoading}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </TablePageLayout>
  );
};

export default TeachingSessionsPage;
