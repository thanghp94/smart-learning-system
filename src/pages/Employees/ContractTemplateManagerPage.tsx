
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import ContractTemplateManager from './ContractTemplateManager';

const ContractTemplateManagerPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý mẫu hợp đồng"
        description="Tạo, quản lý và ghép dữ liệu vào mẫu hợp đồng"
      />
      
      <ContractTemplateManager />
    </div>
  );
};

export default ContractTemplateManagerPage;
