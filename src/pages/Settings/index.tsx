
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';

const settingTabs = [
  {
    id: 'general',
    title: 'Cài đặt chung',
    description: 'Thiết lập các thông tin chung của hệ thống',
    path: '/settings',
  },
  {
    id: 'enum-manager',
    title: 'Quản lý Enum',
    description: 'Quản lý các giá trị enum/danh sách được sử dụng trong hệ thống',
    path: '/settings/enum-manager',
  },
  // Thêm các tab khác nếu cần
];

const Settings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const currentTab = settingTabs.find(tab => tab.path === currentPath)?.id || 'general';
  
  const handleTabChange = (value: string) => {
    const tab = settingTabs.find(tab => tab.id === value);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Cài đặt hệ thống"
        description="Quản lý các thiết lập và cấu hình cho hệ thống"
        icon={<SettingsIcon className="h-6 w-6" />}
      />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Chọn phần cài đặt</CardTitle>
          <CardDescription>
            Chọn một trong các phần cài đặt bên dưới để tiếp tục
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settingTabs.map((tab) => (
              <Card key={tab.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{tab.title}</CardTitle>
                  <CardDescription>{tab.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => navigate(tab.path)}
                  >
                    Truy cập
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
