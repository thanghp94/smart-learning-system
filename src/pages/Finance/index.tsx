import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Finance } from '@/lib/types';
import { financeService } from '@/lib/supabase/finance-service';
import { facilityService } from '@/lib/supabase/facility-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { TablePageLayout } from '@/components/common/TablePageLayout';
import { FinanceForm } from './components/FinanceForm';
import { Plus } from 'lucide-react';

const FinancesPage: React.FC = () => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [facilities, setFacilities] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFinances();
    fetchFacilities();
  }, []);

  const fetchFinances = async () => {
    setIsLoading(true);
    try {
      const data = await financeService.getAll();
      setFinances(data);
    } catch (error) {
      console.error('Error fetching finances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const data = await facilityService.getAll();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const handleAddFinance = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleSubmit = async (values: Finance) => {
    setIsSubmitting(true);
    try {
      await financeService.create(values);
      fetchFinances(); // Refresh data
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating finance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (finance: Finance) => {
    navigate(`/finances/${finance.id}`);
  };

  const columns = [
    {
      title: 'Date',
      key: 'ngay',
      sortable: true,
      render: (value: string) => (value ? format(new Date(value), 'dd/MM/yyyy') : 'N/A'),
    },
    {
      title: 'Description',
      key: 'dien_giai',
      sortable: true,
    },
    {
      title: 'Amount',
      key: 'tong_tien',
      sortable: true,
      render: (value: number) => value?.toLocaleString() || '0',
    },
    {
      title: 'Type',
      key: 'loai_thu_chi',
      sortable: true,
    },
    {
      title: 'Status',
      key: 'tinh_trang',
      sortable: true,
    },
  ];

  return (
    <TablePageLayout>
      <PageHeader
        title="Finances"
        description="Manage financial records"
        buttons={[
          <Button key="add-finance" onClick={handleAddFinance}>
            <Plus className="mr-2 h-4 w-4" />
            Add Finance
          </Button>,
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={finances}
            isLoading={isLoading}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
      {isAdding && (
        <FinanceForm
          onSubmit={handleSubmit}
          onCancel={handleCancelAdd}
          facilities={facilities}
          isLoading={isSubmitting}
        />
      )}
    </TablePageLayout>
  );
};

export default FinancesPage;
