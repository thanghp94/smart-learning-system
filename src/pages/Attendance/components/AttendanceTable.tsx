import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Attendance } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock8,  
  AlertCircle 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AttendanceTableProps {
  data?: Attendance[];
  groupedAttendance?: {
    [key: string]: {
      name: string;
      records: any[];
    }
  };
  uniqueDates?: string[];
  isLoading?: boolean;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  data, 
  groupedAttendance, 
  uniqueDates, 
  isLoading = false 
}) => {
  if (groupedAttendance && uniqueDates) {
    return renderEmployeeAttendanceTable(groupedAttendance, uniqueDates, isLoading);
  }

  const columns: ColumnDef<Attendance>[] = [
    {
      accessorKey: 'student_name',
      header: 'Học Sinh',
    },
    {
      accessorKey: 'date',
      header: 'Ngày',
    },
    {
      accessorKey: 'status',
      header: 'Trạng Thái',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={
            status === 'present' ? 'success' : 
            status === 'absent' ? 'destructive' : 
            status === 'late' ? 'secondary' : 
            'outline'
          }>
            {getStatusText(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'reason',
      header: 'Lý Do',
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div className="space-y-2">
      {Array(5).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const renderEmployeeAttendanceTable = (
  groupedAttendance: {
    [key: string]: {
      name: string;
      records: any[];
    }
  },
  uniqueDates: string[],
  isLoading: boolean
) => {
  if (isLoading) {
    return <div className="space-y-2">
      {Array(5).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>;
  }

  if (Object.keys(groupedAttendance).length === 0) {
    return <div className="text-center py-4">Không có dữ liệu chấm công cho tháng này</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nhân viên</TableHead>
            {uniqueDates.map(date => (
              <TableHead key={date} className="text-center">
                {new Date(date).getDate()}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(groupedAttendance).map(employeeId => (
            <TableRow key={employeeId}>
              <TableCell>{groupedAttendance[employeeId].name}</TableCell>
              {uniqueDates.map(date => {
                const record = groupedAttendance[employeeId].records.find(r => r.ngay === date);
                return (
                  <TableCell key={date} className="text-center">
                    {record ? getStatusIcon(record.trang_thai) : ''}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'present':
      return 'Có Mặt';
    case 'absent':
      return 'Vắng Mặt';
    case 'late':
      return 'Đi Muộn';
    default:
      return 'Không Xác Định';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'present':
      return <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />;
    case 'absent':
      return <XCircle className="h-4 w-4 text-red-500 mx-auto" />;
    case 'late':
      return <Clock8 className="h-4 w-4 text-amber-500 mx-auto" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400 mx-auto" />;
  }
};

export default AttendanceTable;
