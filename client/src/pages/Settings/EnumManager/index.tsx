
import React, { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Settings, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EnumValuesList } from './EnumValuesList';
import { EnumValueForm } from './EnumValueForm';
import { EnumValue, EnumCategory, enumService } from "@/lib/database";
import PageHeader from '@/components/common/PageHeader';

const EnumManager: React.FC = () => {
  const [enumCategories, setEnumCategories] = useState<EnumCategory[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const [showForm, setShowForm] = useState(false);
  const [editingValue, setEditingValue] = useState<EnumValue | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [valueToDelete, setValueToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  // Fetch enum data
  const fetchEnumData = async () => {
    setIsLoading(true);
    try {
      const values = await enumService.getAllEnumValues();
      const categoryNames = await enumService.getEnumCategories();
      
      setCategories(categoryNames);
      const groupedEnums = enumService.groupEnumsByCategory(values);
      setEnumCategories(groupedEnums);
      
      // Set active tab to first category if not set
      if (!activeTab && groupedEnums.length > 0) {
        setActiveTab(groupedEnums[0].name);
      }
    } catch (error) {
      console.error('Error fetching enum data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu enum. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnumData();
  }, []);

  // Handle adding new enum value
  const handleAddValue = async (data: any) => {
    try {
      await enumService.addEnumValue({
        category: data.category,
        value: data.value,
        description: data.description,
        order_num: data.order_num,
      });
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm giá trị enum mới',
      });
      
      setShowForm(false);
      fetchEnumData();
    } catch (error) {
      console.error('Error adding enum value:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm giá trị enum. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  };

  // Handle updating enum value
  const handleUpdateValue = async (data: any) => {
    if (!editingValue) return;
    
    try {
      await enumService.updateEnumValue(editingValue.id, {
        value: data.value,
        description: data.description,
        order_num: data.order_num,
      });
      
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật giá trị enum',
      });
      
      setEditingValue(null);
      setShowForm(false);
      fetchEnumData();
    } catch (error) {
      console.error('Error updating enum value:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật giá trị enum. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  };

  // Handle deleting enum value
  const handleDeleteValue = async () => {
    if (!valueToDelete) return;
    
    try {
      await enumService.deleteEnumValue(valueToDelete);
      
      toast({
        title: 'Thành công',
        description: 'Đã xóa giá trị enum',
      });
      
      setValueToDelete(null);
      setDeleteConfirmOpen(false);
      fetchEnumData();
    } catch (error) {
      console.error('Error deleting enum value:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa giá trị enum. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  };

  // Filter enums based on search query and category filter
  const filteredCategories = enumCategories
    .filter(category => 
      filterCategory === 'all' || category.name === filterCategory
    )
    .map(category => ({
      ...category,
      values: category.values.filter(value => 
        value.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (value.description && value.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(category => category.values.length > 0);

  return (
    <div className="container mx-auto p-4">
      <PageHeader 
        title="Quản lý Enum" 
        description="Quản lý các giá trị enum được sử dụng trong hệ thống" 
        rightContent={
          <Button onClick={() => { setEditingValue(null); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm giá trị mới
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 my-4">
        <div className="md:w-1/3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm giá trị..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="md:w-1/3">
          <Select
            value={filterCategory}
            onValueChange={setFilterCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:w-1/3 flex justify-end">
          <Button variant="outline" onClick={fetchEnumData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredCategories.length > 0 ? (
        <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            {filteredCategories.map((category) => (
              <TabsTrigger key={category.name} value={category.name}>
                {category.name} ({category.values.length})
              </TabsTrigger>
            ))}
          </TabsList>
          
          {filteredCategories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="mt-0">
              <EnumValuesList
                title={`Danh mục: ${category.name}`}
                enumValues={category.values}
                onEdit={(value) => {
                  setEditingValue(value);
                  setShowForm(true);
                }}
                onDelete={(id) => {
                  setValueToDelete(id);
                  setDeleteConfirmOpen(true);
                }}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center my-8">
          <Database className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Không tìm thấy dữ liệu</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterCategory !== 'all'
              ? 'Không tìm thấy kết quả phù hợp. Vui lòng thử lại với tiêu chí khác.'
              : 'Chưa có giá trị enum nào. Hãy thêm giá trị mới để bắt đầu.'}
          </p>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingValue ? 'Cập nhật giá trị enum' : 'Thêm giá trị enum mới'}
            </DialogTitle>
          </DialogHeader>
          <EnumValueForm
            initialData={editingValue || undefined}
            categories={categories}
            isEditMode={!!editingValue}
            onSubmit={editingValue ? handleUpdateValue : handleAddValue}
            onCancel={() => {
              setShowForm(false);
              setEditingValue(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa giá trị enum này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setValueToDelete(null)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteValue}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnumManager;
