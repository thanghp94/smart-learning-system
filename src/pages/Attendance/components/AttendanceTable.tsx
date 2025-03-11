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
// Thay thế Clock bằng Clock8 từ lucide-react
import { 
  CheckCircle, 
  XCircle, 
  Clock8,  // Thay thế Clock bằng Clock8
  AlertCircle 
} from 'lucide-react';

interface AttendanceTableProps {
  data: Attendance[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ data }) => {
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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

  // Cập nhật trong phần render để sử dụng Clock8 thay vì Clock
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'late':
        return <Clock8 className="h-4 w-4 text-amber-500" />; // Thay thế Clock bằng Clock8
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

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

export default AttendanceTable;
