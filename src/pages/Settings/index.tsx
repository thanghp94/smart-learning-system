
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from '@/components/common/PageHeader';
import { Settings as SettingsIcon, List, Database, UserCog, FileText } from 'lucide-react';

const Settings = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader 
        title="Cài đặt" 
        description="Quản lý các thiết lập của hệ thống" 
        icon={<SettingsIcon className="h-6 w-6" />} 
      />
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Thiết lập chung</TabsTrigger>
          <TabsTrigger value="data">Quản lý dữ liệu</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="files">Hồ sơ và tài liệu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SettingCard 
              title="Danh mục" 
              description="Quản lý các loại danh mục trong hệ thống"
              icon={<List />}
              href="/settings/enum-manager"
            />
            
            <SettingCard 
              title="Cấu hình email" 
              description="Thiết lập các mẫu email và thông tin gửi"
              icon={<SettingsIcon />}
            />
            
            <SettingCard 
              title="Thiết lập hiển thị" 
              description="Tùy chỉnh giao diện và cách hiển thị"
              icon={<SettingsIcon />}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SettingCard 
              title="Khởi tạo dữ liệu" 
              description="Thiết lập dữ liệu mẫu hoặc khởi tạo lại"
              icon={<Database />}
            />
            
            <SettingCard 
              title="Sao lưu & phục hồi" 
              description="Quản lý sao lưu và phục hồi dữ liệu"
              icon={<Database />}
            />
            
            <SettingCard 
              title="Nhập/Xuất dữ liệu" 
              description="Chức năng nhập xuất dữ liệu từ file"
              icon={<Database />}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SettingCard 
              title="Phân quyền" 
              description="Quản lý quyền và vai trò người dùng"
              icon={<UserCog />}
            />
            
            <SettingCard 
              title="Nhóm người dùng" 
              description="Quản lý các nhóm và phân quyền nhóm"
              icon={<UserCog />}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="files" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SettingCard 
              title="Quản lý hồ sơ" 
              description="Quản lý hồ sơ nhân viên và văn bản"
              icon={<FileText />}
              href="/employee-files"
            />
            
            <SettingCard 
              title="Cấu hình lưu trữ" 
              description="Thiết lập thư mục và cấu trúc lưu trữ tài liệu"
              icon={<FileText />}
            />
            
            <SettingCard 
              title="Phân loại tài liệu" 
              description="Quản lý các loại tài liệu trong hệ thống"
              icon={<FileText />}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SettingCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

const SettingCard = ({ title, description, icon, href }: SettingCardProps) => {
  const cardContent = (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end pt-2">
        <Button>Truy cập</Button>
      </CardContent>
    </Card>
  );
  
  if (href) {
    return <Link to={href} className="block h-full">{cardContent}</Link>;
  }
  
  return cardContent;
};

export default Settings;
