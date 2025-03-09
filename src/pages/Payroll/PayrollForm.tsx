
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { employeeService } from "@/lib/supabase";
import { Employee, Payroll } from "@/lib/types";

interface PayrollFormProps {
  onSubmit: (data: Partial<Payroll>) => void;
  onCancel?: () => void;
  initialData?: Partial<Payroll>;
}

const PayrollForm = ({ onSubmit, onCancel, initialData }: PayrollFormProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Payroll>>(
    initialData || {
      nhan_su_id: "",
      nam: new Date().getFullYear().toString(),
      thang: (new Date().getMonth() + 1).toString(),
      luong: 0,
      tong_thu_nhap: 0,
      trang_thai: "pending",
    }
  );

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nhân viên",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    // Convert numeric fields to numbers
    if (name === "luong" || name === "tong_thu_nhap" || name === "cong_chuan" || name === "cong_thuc_lam") {
      parsedValue = value === "" ? 0 : parseFloat(value);
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
    
    // Auto-calculate total income when salary changes
    if (name === "luong") {
      const salary = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        tong_thu_nhap: salary,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nhan_su_id">Nhân Viên</Label>
          <Select
            value={formData.nhan_su_id?.toString() || ""}
            onValueChange={(value) => handleSelectChange("nhan_su_id", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="nhan_su_id">
              <SelectValue placeholder="Chọn nhân viên" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.ten_nhan_su}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="thang">Tháng</Label>
            <Select
              value={formData.thang || ""}
              onValueChange={(value) => handleSelectChange("thang", value)}
            >
              <SelectTrigger id="thang">
                <SelectValue placeholder="Tháng" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nam">Năm</Label>
            <Select
              value={formData.nam || ""}
              onValueChange={(value) => handleSelectChange("nam", value)}
            >
              <SelectTrigger id="nam">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="luong">Lương (VND)</Label>
          <Input
            id="luong"
            name="luong"
            type="number"
            value={formData.luong || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tong_thu_nhap">Tổng Thu Nhập (VND)</Label>
          <Input
            id="tong_thu_nhap"
            name="tong_thu_nhap"
            type="number"
            value={formData.tong_thu_nhap || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cong_chuan">Công Chuẩn</Label>
          <Input
            id="cong_chuan"
            name="cong_chuan"
            type="number"
            value={formData.cong_chuan || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cong_thuc_lam">Công Thực Làm</Label>
          <Input
            id="cong_thuc_lam"
            name="cong_thuc_lam"
            type="number"
            value={formData.cong_thuc_lam || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trang_thai">Trạng Thái</Label>
        <Select
          value={formData.trang_thai || "pending"}
          onValueChange={(value) => handleSelectChange("trang_thai", value)}
        >
          <SelectTrigger id="trang_thai">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="paid">Đã thanh toán</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {initialData ? "Cập Nhật" : "Tạo Mới"}
        </Button>
      </div>
    </form>
  );
};

export default PayrollForm;
