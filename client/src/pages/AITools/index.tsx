
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ImageIcon, Video, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import { Link } from 'react-router-dom';

const AITools = () => {
  const tools = [
    {
      title: "Tạo Hình Ảnh AI",
      description: "Tạo hình ảnh từ mô tả văn bản hoặc biến đổi hình ảnh hiện có",
      icon: <ImageIcon className="h-12 w-12 text-primary" />,
      href: "/ai-tools/image-generator",
      color: "bg-blue-50",
    },
    {
      title: "Trò Chuyện AI",
      description: "Trò chuyện với AI để nhận thông tin, hỗ trợ hoặc tạo nội dung",
      icon: <MessageSquare className="h-12 w-12 text-green-500" />,
      href: "/ai-tools/chat",
      color: "bg-green-50",
      disabled: true,
    },
    {
      title: "Tạo Nội Dung Đào Tạo",
      description: "Tự động tạo nội dung đào tạo cho các khóa học",
      icon: <FileText className="h-12 w-12 text-amber-500" />,
      href: "/content-learning",
      color: "bg-amber-50",
    },
    {
      title: "Biên Tập Video",
      description: "Tạo và biên tập video từ nội dung có sẵn",
      icon: <Video className="h-12 w-12 text-red-500" />,
      href: "/ai-tools/video",
      color: "bg-red-50",
      disabled: true,
    },
  ];

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Công Cụ AI"
        description="Sử dụng công nghệ AI tiên tiến để tạo nội dung và cải thiện quy trình làm việc"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool, index) => (
          <Card key={index} className={`border hover:shadow-md transition-shadow ${tool.disabled ? 'opacity-70' : ''}`}>
            <CardHeader className={`${tool.color} rounded-t-lg`}>
              <div className="flex justify-center">
                {tool.icon}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
              <CardDescription className="mb-4">{tool.description}</CardDescription>
              
              <Button 
                variant="outline" 
                className="w-full"
                disabled={tool.disabled}
                asChild={!tool.disabled}
              >
                {tool.disabled ? (
                  <span>Sắp ra mắt <ArrowRight className="ml-2 h-4 w-4" /></span>
                ) : (
                  <Link to={tool.href}>
                    Truy cập <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center text-muted-foreground">
        <p>Các công cụ AI được cung cấp để hỗ trợ quá trình giáo dục và quản lý.</p>
        <p>Chúng tôi liên tục cập nhật thêm các tính năng mới.</p>
      </div>
    </div>
  );
};

export default AITools;
