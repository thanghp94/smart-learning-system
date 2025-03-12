
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmployeeContractTabProps {
  employeeId: string;
}

const EmployeeContractTab: React.FC<EmployeeContractTabProps> = ({ employeeId }) => {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true);
        // Here we would fetch contracts using a contract service
        // For now, let's set it to an empty array
        setContracts([]);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [employeeId]);

  const handleAddContract = () => {
    // This would open a dialog to add a new contract
    console.log('Add contract for employee ID:', employeeId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Hợp đồng nhân viên</h3>
          <Button onClick={handleAddContract}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm hợp đồng
          </Button>
        </div>

        {contracts.length > 0 ? (
          <div className="border rounded-md">
            {/* Contract list would go here */}
            <p className="p-4">Danh sách hợp đồng</p>
          </div>
        ) : (
          <p className="text-center text-muted-foreground p-4 border rounded-md">
            Nhân viên chưa có hợp đồng nào
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeContractTab;
