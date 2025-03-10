
import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Image } from "@/lib/types";
import { imageService } from "@/lib/supabase/image-service";
import { useToast } from "@/hooks/use-toast";
import ImageUploadForm from "./ImageUploadForm";

const Images: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const data = await imageService.getAll();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        title: "Error",
        description: "Failed to load images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = () => {
    setShowUploadForm(true);
  };

  const handleCloseUploadForm = () => {
    setShowUploadForm(false);
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchImages();
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      await imageService.delete(id);
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      !searchTerm ||
      (image.ten_anh && image.ten_anh.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (image.caption && image.caption.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEntityType = !entityFilter || image.doi_tuong === entityFilter;

    return matchesSearch && matchesEntityType;
  });

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Hình Ảnh"
        description="Quản lý kho hình ảnh trong hệ thống"
        action={{
          label: "Thêm Hình Ảnh",
          onClick: handleAddImage,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      {showUploadForm ? (
        <ImageUploadForm
          onSuccess={handleUploadSuccess}
          onCancel={handleCloseUploadForm}
        />
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tìm kiếm hình ảnh</CardTitle>
              <CardDescription>
                Tìm kiếm hình ảnh theo tên hoặc mô tả
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Tìm theo tên hoặc mô tả..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={fetchImages}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Làm mới
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : filteredImages.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium">Không tìm thấy hình ảnh</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  {searchTerm
                    ? "Không có hình ảnh nào phù hợp với từ khóa tìm kiếm."
                    : "Chưa có hình ảnh nào trong hệ thống."}
                </p>
                <Button onClick={handleAddImage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Hình Ảnh
                </Button>
              </div>
            ) : (
              filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden group relative">
                  <div className="aspect-square relative overflow-hidden">
                    {image.image ? (
                      <img
                        src={image.image}
                        alt={image.caption || image.ten_anh}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{image.ten_anh}</h3>
                    {image.caption && (
                      <p className="text-sm text-muted-foreground truncate">
                        {image.caption}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {image.doi_tuong}: {image.doi_tuong_id}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Images;
