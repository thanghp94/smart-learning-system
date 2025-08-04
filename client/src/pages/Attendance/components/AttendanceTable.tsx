
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock8, Check, X, AlertCircle, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { attendanceService } from "@/lib/database";
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

// New interface that matches the props being passed
export interface AttendanceTableProps {
  groupedAttendance: GroupedAttendance;
  uniqueDates: string[];
  isLoading: boolean;
}

export interface GroupedAttendance {
  [key: string]: {
    employee: {
      id: string;
      name: string;
    };
    dates: {
      [date: string]: {
        id: string | null;
        status: string | null;
        note: string | null;
      };
    };
  };
}

const statusColors = {
  present: 'bg-green-100 text-green-800 border-green-300',
  absent: 'bg-red-100 text-red-800 border-red-300',
  late: 'bg-amber-100 text-amber-800 border-amber-300',
  pending: 'bg-gray-100 text-gray-800 border-gray-300',
};

const iconClasses = "h-4 w-4";

const AttendanceTable: React.FC<AttendanceTableProps> = ({ groupedAttendance, uniqueDates, isLoading }) => {
  const { toast } = useToast();
  const [editingNote, setEditingNote] = useState<{ id: string | null, note: string } | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  
  const handleStatusUpdate = async (attendanceId: string | null, employeeId: string, date: string, newStatus: string) => {
    if (!attendanceId) {
      // Create new attendance record
      try {
        setProcessingIds(prev => new Set(prev).add(employeeId + date));

        const { data, error } = await attendanceService.createEmployeeAttendance({
          nhan_vien_id: employeeId,
          ngay: date,
          trang_thai: newStatus,
        });
        
        if (error) throw error;
        
        toast({
          title: 'Cập nhật thành công',
          description: 'Đã cập nhật trạng thái điểm danh',
        });
        
        // Here you would normally update your local state
        // This would trigger a refetch of the data in the parent component
      } catch (error) {
        console.error('Error updating attendance status:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể cập nhật trạng thái điểm danh',
          variant: 'destructive',
        });
      } finally {
        setProcessingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(employeeId + date);
          return newSet;
        });
      }
    } else {
      // Update existing attendance record
      try {
        setProcessingIds(prev => new Set(prev).add(attendanceId));
        
        const { error } = await attendanceService.updateEmployeeAttendance(attendanceId, {
          trang_thai: newStatus
        });
        
        if (error) throw error;
        
        toast({
          title: 'Cập nhật thành công',
          description: 'Đã cập nhật trạng thái điểm danh',
        });
        
        // Here you would normally update your local state
        // This would trigger a refetch of the data in the parent component
      } catch (error) {
        console.error('Error updating attendance status:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể cập nhật trạng thái điểm danh',
          variant: 'destructive',
        });
      } finally {
        setProcessingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(attendanceId);
          return newSet;
        });
      }
    }
  };

  const handleNoteUpdate = async () => {
    if (!editingNote || !editingNote.id) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(editingNote.id!));
      
      const { error } = await attendanceService.updateEmployeeAttendance(editingNote.id, {
        ghi_chu: tempNote
      });
      
      if (error) throw error;
      
      toast({
        title: 'Cập nhật thành công',
        description: 'Đã cập nhật ghi chú điểm danh',
      });
      
      // Here you would normally update your local state
      // This would trigger a refetch of the data in the parent component
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating attendance note:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật ghi chú điểm danh',
        variant: 'destructive',
      });
    } finally {
      if (editingNote && editingNote.id) {
        setProcessingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(editingNote.id!);
          return newSet;
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Đang tải dữ liệu điểm danh...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statuses = [
    { value: 'present', label: 'Có mặt', icon: <Check className={iconClasses} /> },
    { value: 'absent', label: 'Vắng mặt', icon: <X className={iconClasses} /> },
    { value: 'late', label: 'Đi trễ', icon: <Clock8 className={iconClasses} /> },
    { value: 'pending', label: 'Chưa có', icon: <History className={iconClasses} /> },
  ];

  return (
    <Card className="shadow-sm">
      <CardContent className="p-3 md:p-4 overflow-auto">
        <Table className="min-w-full border-collapse border">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-left font-medium sticky left-0 bg-muted/50 min-w-[180px] z-10">
                Nhân viên
              </TableHead>
              {uniqueDates.map((date) => (
                <TableHead key={date} className="text-center font-medium p-2 min-w-[120px]">
                  {new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(groupedAttendance).map((data) => (
              <TableRow key={data.employee.id} className="hover:bg-muted/30">
                <TableCell className="font-medium sticky left-0 bg-white z-10">
                  {data.employee.name || 'Không tên'}
                </TableCell>
                
                {uniqueDates.map((date) => {
                  const record = data.dates[date] || { id: null, status: 'pending', note: null };
                  const isProcessing = record.id 
                    ? processingIds.has(record.id)
                    : processingIds.has(data.employee.id + date);
                    
                  return (
                    <TableCell key={date} className="text-center p-2">
                      <div className="relative flex flex-col items-center">
                        <div className="flex space-x-1 mb-1">
                          {statuses.map((status) => (
                            <TooltipProvider key={status.value}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant={record.status === status.value ? "default" : "outline"}
                                    className={`h-7 w-7 p-0 ${record.status === status.value ? '' : 'opacity-50'}`}
                                    onClick={() => handleStatusUpdate(record.id, data.employee.id, date, status.value)}
                                    disabled={isProcessing}
                                  >
                                    {status.icon}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{status.label}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                        
                        {record.id && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                disabled={isProcessing}
                              >
                                {record.note ? 'Xem ghi chú' : 'Thêm ghi chú'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72">
                              <div className="space-y-2">
                                <h4 className="font-medium">Ghi chú</h4>
                                <Input
                                  placeholder="Thêm ghi chú cho điểm danh"
                                  defaultValue={record.note || ''}
                                  onChange={(e) => setTempNote(e.target.value)}
                                  onClick={() => {
                                    setEditingNote({
                                      id: record.id,
                                      note: record.note || ''
                                    });
                                    setTempNote(record.note || '');
                                  }}
                                />
                                <div className="flex justify-end">
                                  <Button 
                                    size="sm" 
                                    onClick={handleNoteUpdate}
                                    disabled={!editingNote || editingNote.id !== record.id || isProcessing}
                                  >
                                    Lưu
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                        
                        {isProcessing && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20">
                            <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            
            {Object.keys(groupedAttendance).length === 0 && (
              <TableRow>
                <TableCell colSpan={uniqueDates.length + 1} className="h-32 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Không có dữ liệu điểm danh nào.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
