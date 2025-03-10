
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { imageService } from "@/lib/supabase";

interface ImageUploadFormProps {
  sessionId: string;
  onUploadComplete: () => void;
  onCancel: () => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  sessionId,
  onUploadComplete,
  onCancel
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn một ảnh để tải lên",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload the file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `teaching_sessions/${fileName}`;
      
      const { data: storageData, error: storageError } = await imageService.uploadFile(
        "images",
        filePath,
        file
      );
      
      if (storageError) throw storageError;
      
      // Create an image record in the database
      const imageData = {
        caption,
        doi_tuong: "teaching_session",
        doi_tuong_id: sessionId,
        ten_anh: file.name,
        image: filePath
      };
      
      const { error: dbError } = await imageService.create(imageData);
      
      if (dbError) throw dbError;
      
      toast({
        title: "Thành công",
        description: "Đã tải lên ảnh thành công",
      });
      
      onUploadComplete();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lên ảnh. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Chọn ảnh</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1"
          />
          {file && (
            <div className="h-12 w-12 rounded border flex items-center justify-center bg-muted">
              <Image className="h-6 w-6" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption">Mô tả ảnh</Label>
        <Textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Mô tả ngắn gọn về ảnh"
          rows={3}
        />
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Đang tải lên..." : "Tải lên"}
          {!isUploading && <Upload className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
};

export default ImageUploadForm;
