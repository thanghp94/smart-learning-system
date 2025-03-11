
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import CommandInterface from '@/components/CommandInterface';

const AICommandsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Trợ lý ra lệnh AI"
        description="Sử dụng ngôn ngữ tự nhiên hoặc giọng nói để thực hiện các thao tác trong hệ thống"
      />
      
      <div className="mt-6">
        <CommandInterface />
      </div>
    </div>
  );
};

export default AICommandsPage;
