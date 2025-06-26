
import React, { useState, useEffect } from "react";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { assetService, assetTransferService, facilityService, studentService, employeeService, classService } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";

interface AssetTransferProps {
  asset: Asset;
  onTransferComplete: () => void;
}

const AssetTransferForm = ({ asset, onTransferComplete }: AssetTransferProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [sourceType, setSourceType] = useState<string>(asset.doi_tuong || "facility");
  const [sourceId, setSourceId] = useState<string>(asset.doi_tuong_id || "");
  const [sourceName, setSourceName] = useState<string>("");
  
  const [destinationType, setDestinationType] = useState<string>("facility");
  const [destinationId, setDestinationId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [transferDate, setTransferDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Entity data
  const [facilities, setFacilities] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Load source entity name
  useEffect(() => {
    const fetchSourceName = async () => {
      if (asset.doi_tuong && asset.doi_tuong_id) {
        try {
          let name = "";
          
          switch (asset.doi_tuong) {
            case "facility":
              const facility = await facilityService.getById(asset.doi_tuong_id);
              name = facility?.ten_co_so || "Unknown facility";
              break;
            case "student":
              const student = await studentService.getById(asset.doi_tuong_id);
              name = student?.ten_hoc_sinh || "Unknown student";
              break;
            case "employee":
              const employee = await employeeService.getById(asset.doi_tuong_id);
              name = employee?.ten_nhan_su || "Unknown employee";
              break;
            case "class":
              const classData = await classService.getById(asset.doi_tuong_id);
              name = classData?.ten_lop_full || classData?.ten_lop || "Unknown class";
              break;
            default:
              name = "Unknown source";
          }
          
          setSourceName(name);
        } catch (error) {
          console.error("Error fetching source entity:", error);
        }
      }
    };
    
    fetchSourceName();
  }, [asset.doi_tuong, asset.doi_tuong_id]);

  // Load entities for destination dropdown
  useEffect(() => {
    const loadEntities = async () => {
      setIsLoading(true);
      try {
        switch (destinationType) {
          case "facility":
            const facilityData = await facilityService.getAll();
            setFacilities(facilityData);
            break;
          case "student":
            const studentData = await studentService.getAll();
            setStudents(studentData);
            break;
          case "employee":
            const employeeData = await employeeService.getAll();
            setEmployees(employeeData);
            break;
          case "class":
            const classData = await classService.getAll();
            setClasses(classData);
            break;
        }
      } catch (error) {
        console.error("Error loading entities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEntities();
  }, [destinationType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0 || quantity > asset.so_luong) {
      toast({
        title: "Lỗi",
        description: `Số lượng phải từ 1 đến ${asset.so_luong}`,
        variant: "destructive",
      });
      return;
    }

    if (!destinationType || !destinationId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn đích đến của tài sản",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await assetTransferService.create({
        asset_id: asset.id,
        source_type: sourceType,
        source_id: sourceId,
        destination_type: destinationType,
        destination_id: destinationId,
        quantity: quantity,
        transfer_date: transferDate,
        status: "pending",
        notes: notes
      });

      toast({
        title: "Thành công",
        description: `Đã tạo yêu cầu chuyển ${quantity} ${asset.ten_CSVC}`,
      });
      
      onTransferComplete();
    } catch (error: any) {
      console.error("Error creating transfer:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo yêu cầu chuyển tài sản",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxQuantity = asset.so_luong || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRight className="h-5 w-5 mr-2" />
          Chuyển Tài Sản
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{asset.ten_CSVC}</h3>
                <p className="text-sm text-muted-foreground">
                  Loại: {asset.loai} - Danh mục: {asset.danh_muc}
                </p>
                {asset.so_tien_mua && (
                  <p className="text-sm text-muted-foreground">
                    Giá: {formatCurrency(parseFloat(asset.so_tien_mua))}
                  </p>
                )}
              </div>
              <Badge variant={
                asset.tinh_trang === "good" ? "success" : 
                asset.tinh_trang === "damaged" ? "destructive" : 
                "secondary"
              }>
                {asset.tinh_trang === "good" ? "Tốt" : 
                 asset.tinh_trang === "damaged" ? "Hư hỏng" : 
                 asset.tinh_trang === "maintenance" ? "Bảo trì" : asset.tinh_trang}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source_type">Nguồn hiện tại</Label>
              <Select 
                value={sourceType} 
                onValueChange={setSourceType}
                disabled={true}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại nguồn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facility">Cơ Sở</SelectItem>
                  <SelectItem value="student">Học Sinh</SelectItem>
                  <SelectItem value="employee">Nhân Viên</SelectItem>
                  <SelectItem value="class">Lớp Học</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source_name">Tên nguồn hiện tại</Label>
              <Input 
                id="source_name" 
                value={sourceName} 
                disabled={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination_type">Đích Đến</Label>
              <Select 
                value={destinationType} 
                onValueChange={setDestinationType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại đích đến" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facility">Cơ Sở</SelectItem>
                  <SelectItem value="student">Học Sinh</SelectItem>
                  <SelectItem value="employee">Nhân Viên</SelectItem>
                  <SelectItem value="class">Lớp Học</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination_id">Chọn đích đến</Label>
              <Select
                value={destinationId}
                onValueChange={setDestinationId}
                disabled={isLoading}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn đích đến"} />
                </SelectTrigger>
                <SelectContent>
                  {destinationType === "facility" && 
                    facilities.map(facility => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.ten_co_so}
                      </SelectItem>
                    ))
                  }
                  
                  {destinationType === "student" && 
                    students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.ten_hoc_sinh}
                      </SelectItem>
                    ))
                  }
                  
                  {destinationType === "employee" && 
                    employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.ten_nhan_su}
                      </SelectItem>
                    ))
                  }
                  
                  {destinationType === "class" && 
                    classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.ten_lop_full || cls.ten_lop}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Số Lượng</Label>
              <Input 
                id="quantity" 
                type="number" 
                min={1} 
                max={maxQuantity}
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
                required
              />
              <p className="text-xs text-muted-foreground">
                Số lượng hiện có: {asset.so_luong} {asset.don_vi}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer_date">Ngày Chuyển</Label>
              <Input 
                id="transfer_date" 
                type="date" 
                value={transferDate} 
                onChange={(e) => setTransferDate(e.target.value)} 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi Chú</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Tạo Yêu Cầu Chuyển"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssetTransferForm;
