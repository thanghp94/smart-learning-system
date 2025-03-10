
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { EnumValue, EnumCategory, enumService } from '@/lib/supabase/enum-service';
import { EnumValueForm } from './EnumValueForm';
import { EnumValuesList } from './EnumValuesList';
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
import PageHeader from '@/components/common/PageHeader';

const EnumManager: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  const [groupedEnums, setGroupedEnums] = useState<EnumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEnum, setCurrentEnum] = useState<EnumValue | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allEnums = await enumService.getAllEnumValues();
        const categoryList = await enumService.getEnumCategories();
        
        const grouped = enumService.groupEnumsByCategory(allEnums);
        
        setCategories(categoryList);
        setGroupedEnums(grouped);
        
        if (categoryList.length > 0 && !activeTab) {
          setActiveTab(categoryList[0]);
        }
      } catch (error) {
        console.error('Error loading enum data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu enum. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [refreshTrigger, toast, activeTab]);

  const handleAddEnumValue = async (data: Omit<EnumValue, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await enumService.addEnumValue(data);
      setIsAddDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
      toast({
        title: 'Thành công',
        description: 'Đã thêm giá trị enum mới.',
      });
    } catch (error) {
      console.error('Error adding enum value:', error);
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể thêm giá trị enum.',
        variant: 'destructive',
      });
    }
  };

  const handleEditEnumValue = async (data: Omit<EnumValue, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentEnum) return;
    
    try {
      await enumService.updateEnumValue(currentEnum.id, {
        value: data.value,
        description: data.description,
        order_num: data.order_num,
      });
      
      setIsEditDialogOpen(false);
      setCurrentEnum(null);
      setRefreshTrigger(prev => prev + 1);
      
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật giá trị enum.',
      });
    } catch (error) {
      console.error('Error updating enum value:', error);
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật giá trị enum.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEnumValue = async () => {
    if (!currentEnum) return;
    
    try {
      await enumService.deleteEnumValue(currentEnum.id);
      
      setIsDeleteDialogOpen(false);
      setCurrentEnum(null);
      setRefreshTrigger(prev => prev + 1);
      
      toast({
        title: 'Thành công',
        description: 'Đã xóa giá trị enum.',
      });
    } catch (error) {
      console.error('Error deleting enum value:', error);
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa giá trị enum.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenEditDialog = (enumValue: EnumValue) => {
    setCurrentEnum(enumValue);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    const enumToDelete = groupedEnums
      .flatMap(category => category.values)
      .find(enumValue => enumValue.id === id);
    
    if (enumToDelete) {
      setCurrentEnum(enumToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <PageHeader 
        title="Quản lý Enum Values" 
        description="Quản lý các giá trị enum được sử dụng trong ứng dụng"
        rightContent={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm giá trị mới
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm giá trị enum mới</DialogTitle>
                </DialogHeader>
                <EnumValueForm
                  categories={categories}
                  onSubmit={handleAddEnumValue}
                  isEditMode={false}
                  initialData={{ category: activeTab }}
                />
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="mb-4 flex flex-wrap">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {groupedEnums.map(category => (
            <TabsContent key={category.name} value={category.name}>
              <EnumValuesList
                enumValues={category.values}
                onEdit={handleOpenEditDialog}
                onDelete={handleOpenDeleteDialog}
                title={`Danh mục: ${category.name}`}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa giá trị enum</DialogTitle>
          </DialogHeader>
          {currentEnum && (
            <EnumValueForm
              initialData={currentEnum}
              categories={categories}
              onSubmit={handleEditEnumValue}
              isEditMode={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa giá trị enum '{currentEnum?.value}' trong danh mục '{currentEnum?.category}'?
              <br />
              <span className="font-bold text-destructive">
                Lưu ý: Việc xóa có thể ảnh hưởng đến dữ liệu hiện có sử dụng giá trị này.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEnumValue}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnumManager;
