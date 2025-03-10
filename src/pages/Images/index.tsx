import React, { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, RotateCw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/lib/types";
import { imageService } from "@/lib/supabase/image-service";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageUploadForm from "./ImageUploadForm";
import ImageDetailView from "./ImageDetailView";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ExportButton from "@/components/ui/ExportButton";

const Images: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const data = await imageService.getAll();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    setShowDetailView(true);
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchImages();
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
  };

  const handleAddImage = () => {
    setShowUploadForm(true);
  };

  const handleDeleteClick = (image: Image, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(image);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedImage) return;
    
    try {
      await imageService.delete(selectedImage.id);
      fetchImages();
      setShowDeleteConfirm(false);
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const renderImageGrid = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <RotateCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading images...</span>
        </div>
      );
    }

    if (images.length === 0) {
      return (
        <PlaceholderPage
          title="No Images Found"
          description="Upload your first image to get started"
          addButtonAction={handleAddImage}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleImageClick(image)}
          >
            <div className="relative aspect-square bg-muted">
              {image.image ? (
                <img
                  src={image.image}
                  alt={image.caption || image.ten_anh}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-8 w-8"
                onClick={(e) => handleDeleteClick(image, e)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium truncate">{image.ten_anh}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {image.doi_tuong}: {image.caption || "No caption"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {image.tg_tao
                  ? format(new Date(image.tg_tao), "dd/MM/yyyy")
                  : "Unknown date"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const getExportableImageData = () => {
    return images.map(image => {
      const { image: imageUrl, ...rest } = image;
      return {
        ...rest,
        image_url: imageUrl ? 'Yes' : 'No',
      };
    });
  };

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchImages}>
        <RotateCw className="h-4 w-4 mr-1" /> Refresh
      </Button>
      <ExportButton 
        data={getExportableImageData()} 
        filename="Danh_sach_hinh_anh" 
        label="Xuất dữ liệu"
      />
      <Button size="sm" className="h-8" onClick={handleAddImage}>
        <Plus className="h-4 w-4 mr-1" /> Add Image
      </Button>
    </div>
  );

  return (
    <>
      <TablePageLayout
        title="Images"
        description="Manage images for your application"
        actions={tableActions}
      >
        {renderImageGrid()}
      </TablePageLayout>

      <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <ImageUploadForm
            onSuccess={handleUploadSuccess}
            onCancel={() => setShowUploadForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailView} onOpenChange={setShowDetailView}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Image Details</DialogTitle>
          </DialogHeader>
          {selectedImage && <ImageDetailView image={selectedImage} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Images;
