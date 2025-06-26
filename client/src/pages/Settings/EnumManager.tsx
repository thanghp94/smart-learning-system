
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PageHeader from '@/components/common/PageHeader';

const categories = [
  { id: 'asset_types', name: 'Loại tài sản' },
  { id: 'colors', name: 'Màu sắc' },
  { id: 'brands', name: 'Thương hiệu' },
  { id: 'departments', name: 'Phòng ban' },
  { id: 'positions', name: 'Chức vụ' },
  { id: 'request_types', name: 'Loại đề xuất' },
];

const EnumManager = () => {
  const [activeCategory, setActiveCategory] = useState('asset_types');
  const [values, setValues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState<any>(null);
  const [formData, setFormData] = useState({ value: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchValues();
  }, [activeCategory]);

  const fetchValues = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('enum_values')
        .select('*')
        .eq('category', activeCategory)
        .order('order_num', { ascending: true });

      if (error) throw error;
      setValues(data || []);
    } catch (error) {
      console.error('Error fetching enum values:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách giá trị',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddValue = () => {
    setCurrentValue(null);
    setFormData({ value: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleEditValue = (value: any) => {
    setCurrentValue(value);
    setFormData({
      value: value.value,
      description: value.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteValue = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa giá trị này?')) return;

    try {
      const { error } = await supabase.rpc('delete_enum_value', { p_id: id });

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã xóa giá trị thành công',
      });
      
      fetchValues();
    } catch (error) {
      console.error('Error deleting enum value:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa giá trị',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let result;
      
      if (currentValue) {
        // Update existing value
        result = await supabase.rpc('update_enum_value', {
          p_id: currentValue.id,
          p_value: formData.value,
          p_description: formData.description,
        });
      } else {
        // Add new value
        result = await supabase.rpc('add_enum_value', {
          p_category: activeCategory,
          p_value: formData.value,
          p_description: formData.description,
        });
      }

      if (result.error) throw result.error;

      toast({
        title: 'Thành công',
        description: currentValue ? 'Đã cập nhật giá trị' : 'Đã thêm giá trị mới',
      });
      
      setIsDialogOpen(false);
      fetchValues();
    } catch (error) {
      console.error('Error saving enum value:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu giá trị',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Quản lý danh mục"
        description="Quản lý các giá trị danh mục trong hệ thống"
        icon={<PlusCircle className="h-6 w-6" />}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <Button onClick={handleAddValue}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm giá trị
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Giá trị</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {values.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            Không có dữ liệu
                          </TableCell>
                        </TableRow>
                      ) : (
                        values.map((value) => (
                          <TableRow key={value.id}>
                            <TableCell className="font-medium">{value.value}</TableCell>
                            <TableCell>{value.description || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditValue(value)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteValue(value.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentValue ? 'Chỉnh sửa giá trị' : 'Thêm giá trị mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value">Giá trị</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnumManager;
