
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EnumValue } from "@/lib/database";
import { Pencil, Trash2 } from 'lucide-react';

interface EnumValuesListProps {
  enumValues: EnumValue[];
  onEdit: (value: EnumValue) => void;
  onDelete: (id: string) => void;
  title: string;
}

export const EnumValuesList: React.FC<EnumValuesListProps> = ({
  enumValues,
  onEdit,
  onDelete,
  title,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Danh sách các giá trị enum trong danh mục này.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Giá trị</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Thứ tự</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enumValues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              enumValues.map((enumValue) => (
                <TableRow key={enumValue.id}>
                  <TableCell className="font-medium">{enumValue.value}</TableCell>
                  <TableCell>{enumValue.description || '-'}</TableCell>
                  <TableCell>{enumValue.order_num || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(enumValue)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Sửa</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(enumValue.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
