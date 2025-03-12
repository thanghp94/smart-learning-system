import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/DataTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Asset, AssetTransfer } from '@/lib/types';
import { assetService, assetTransferService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const TransferManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [transfers, setTransfers] = useState<AssetTransfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState<string>('');
  const [destinationType, setDestinationType] = useState<string>('facility');
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const assetsData = await assetService.getAll();
      setAssets(assetsData);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tài sản",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAssetId) {
      fetchTransfers(selectedAssetId);
    } else {
      setTransfers([]);
    }
  }, [selectedAssetId]);

  const fetchTransfers = async (assetId: string) => {
    try {
      setLoading(true);
      const transfersData = await assetTransferService.getTransfersByAssetId(assetId);
      setTransfers(transfersData);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách chuyển tài sản",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedAssetId || !destination) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng chọn tài sản và nơi chuyển đến",
        variant: "destructive"
      });
      return;
    }

    try {
      await assetTransferService.createTransfer({
        asset_id: selectedAssetId,
        source_type: 'facility',
        source_id: assets.find(a => a.id === selectedAssetId)?.doi_tuong_id || '',
        destination_type: destinationType,
        destination_id: destination,
        quantity: 1,
        transfer_date: new Date().toISOString().split('T')[0],
        status: 'pending'
      });

      toast({
        title: "Thành công",
        description: "Đã tạo yêu cầu chuyển tài sản",
      });

      if (selectedAssetId) {
        fetchTransfers(selectedAssetId);
      }
    } catch (error) {
      console.error('Error creating transfer:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo yêu cầu chuyển tài sản",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Ngày chuyển",
      key: "transfer_date",
      render: (value: string) => format(new Date(value), 'dd/MM/yyyy'),
    },
    {
      title: "Nguồn",
      key: "source_type",
      render: (value: string, record: AssetTransfer) => `${value} - ${record.source_id}`,
    },
    {
      title: "Đích",
      key: "destination_type",
      render: (value: string, record: AssetTransfer) => `${value} - ${record.destination_id}`,
    },
    {
      title: "Số lượng",
      key: "quantity",
    },
    {
      title: "Trạng thái",
      key: "status",
    },
  ];

  return (
    <div>
      <Tabs defaultValue="transfer">
        <TabsList>
          <TabsTrigger value="transfer">Chuyển tài sản</TabsTrigger>
          <TabsTrigger value="history">Lịch sử chuyển</TabsTrigger>
        </TabsList>
        <TabsContent value="transfer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Thông tin tài sản</h3>
              <Select onValueChange={setSelectedAssetId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn tài sản" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.ten_CSVC}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Thông tin chuyển</h3>
              <Select onValueChange={setDestinationType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại đích" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facility">Cơ sở</SelectItem>
                  <SelectItem value="employee">Nhân viên</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Nhập ID đích"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-2"
              />
              <Button onClick={handleTransfer} className="mt-4">
                Chuyển tài sản
              </Button>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <DataTable columns={columns} data={transfers} isLoading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransferManagement;
