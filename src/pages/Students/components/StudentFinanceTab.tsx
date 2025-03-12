
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CreditCard, Plus } from 'lucide-react';
import EntityFinancesView from '@/pages/Finance/components/EntityFinancesView';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StudentFinanceTabProps {
  studentId: string;
}

const StudentFinanceTab: React.FC<StudentFinanceTabProps> = ({ studentId }) => {
  const navigate = useNavigate();

  const handleAddFinance = () => {
    // Navigate to finance form with pre-filled entity type and ID
    navigate(`/finance/new?entityType=hoc_sinh&entityId=${studentId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Lịch sử tài chính
        </CardTitle>
        <Button onClick={handleAddFinance} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Thêm khoản thu chi
        </Button>
      </CardHeader>
      <CardContent>
        <EntityFinancesView entityType="hoc_sinh" entityId={studentId} />
      </CardContent>
    </Card>
  );
};

export default StudentFinanceTab;
