
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ExampleCommandsProps {
  setCommand: (command: string) => void;
}

const ExampleCommands: React.FC<ExampleCommandsProps> = ({ setCommand }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Ví dụ lệnh</CardTitle>
        <CardDescription>
          Bạn có thể sử dụng các lệnh dưới đây để thực hiện nhanh các tác vụ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="p-2 rounded bg-muted/50 hover:bg-muted cursor-pointer" 
               onClick={() => setCommand('Thêm học sinh Trần Văn A, số điện thoại 0987654321')}>
            <p className="font-medium">Thêm học sinh Trần Văn A, số điện thoại 0987654321</p>
            <p className="text-sm text-muted-foreground">Thêm học sinh mới vào hệ thống</p>
          </div>
          
          <div className="p-2 rounded bg-muted/50 hover:bg-muted cursor-pointer"
               onClick={() => setCommand('Cập nhật học sinh Nguyễn Văn B với email mới abc@gmail.com')}>
            <p className="font-medium">Cập nhật học sinh Nguyễn Văn B với email mới abc@gmail.com</p>
            <p className="text-sm text-muted-foreground">Cập nhật thông tin học sinh</p>
          </div>
          
          <div className="p-2 rounded bg-muted/50 hover:bg-muted cursor-pointer"
               onClick={() => setCommand('Kiểm tra thông tin học sinh Lê Thị C')}>
            <p className="font-medium">Kiểm tra thông tin học sinh Lê Thị C</p>
            <p className="text-sm text-muted-foreground">Xem thông tin chi tiết về học sinh</p>
          </div>
          
          <div className="p-2 rounded bg-muted/50 hover:bg-muted cursor-pointer"
               onClick={() => setCommand('Gửi email đến phụ huynh Trần Văn A thông báo về lịch học')}>
            <p className="font-medium">Gửi email đến phụ huynh Trần Văn A thông báo về lịch học</p>
            <p className="text-sm text-muted-foreground">Gửi email thông báo đến phụ huynh</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExampleCommands;
