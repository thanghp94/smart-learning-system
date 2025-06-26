
import React from 'react';
import { Student } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Phone, Mail, Home, School, MessageSquare, Book, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import ImageUpload from '@/components/common/ImageUpload';

interface StudentInfoTabProps {
  student: Student;
  isEditing: boolean;
  tempStudentData: Student | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (url: string) => void;
  facilityName: string;
}

const StudentInfoTab: React.FC<StudentInfoTabProps> = ({ 
  student, 
  isEditing, 
  tempStudentData, 
  handleChange, 
  handleImageUpload,
  facilityName
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="ho_va_ten">Họ và tên</Label>
                  <Input
                    id="ho_va_ten"
                    name="ho_va_ten"
                    value={tempStudentData?.ho_va_ten || tempStudentData?.ten_hoc_sinh || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gioi_tinh">Giới tính</Label>
                  <select
                    id="gioi_tinh"
                    name="gioi_tinh"
                    value={tempStudentData?.gioi_tinh || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="">Khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ngay_sinh">Ngày sinh</Label>
                  <Input
                    id="ngay_sinh"
                    name="ngay_sinh"
                    type="date"
                    value={tempStudentData?.ngay_sinh || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trang_thai">Trạng thái</Label>
                  <select
                    id="trang_thai"
                    name="trang_thai"
                    value={tempStudentData?.trang_thai || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="active">Đang học</option>
                    <option value="inactive">Đã nghỉ</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anh_minh_hoc">Hình ảnh</Label>
                  <ImageUpload
                    value={tempStudentData?.anh_minh_hoc || ''}
                    onChange={handleImageUpload}
                    onRemove={() => handleImageUpload('')}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Họ và tên</span>
                    <p className="font-medium">{student.ho_va_ten || student.ten_hoc_sinh}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Giới tính</span>
                    <p className="font-medium">{student.gioi_tinh || 'Chưa cập nhật'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Ngày sinh</span>
                    <p className="font-medium flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                      {student.ngay_sinh ? format(new Date(student.ngay_sinh), 'dd/MM/yyyy') : 'Chưa cập nhật'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Trạng thái</span>
                    <p className="font-medium">
                      <Badge variant={student.trang_thai === 'active' ? 'default' : 'secondary'}>
                        {student.trang_thai === 'active' ? 'Đang học' : 'Đã nghỉ'}
                      </Badge>
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Cơ sở</span>
                    <p className="font-medium flex items-center">
                      <School className="w-3 h-3 mr-1 text-muted-foreground" />
                      {facilityName || 'Chưa xác định'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="mr-2 h-5 w-5" />
              Thông tin học tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="ct_hoc">Chương trình học</Label>
                  <Input
                    id="ct_hoc"
                    name="ct_hoc"
                    value={tempStudentData?.ct_hoc || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="truong">Trường</Label>
                  <Input
                    id="truong"
                    name="truong"
                    value={tempStudentData?.truong || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lop">Lớp</Label>
                  <Input
                    id="lop"
                    name="lop"
                    value={tempStudentData?.lop || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nguon_den">Nguồn đến</Label>
                  <Input
                    id="nguon_den"
                    name="nguon_den"
                    value={tempStudentData?.nguon_den || ''}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="han_hoc_phi">Hạn học phí</Label>
                  <Input
                    type="date"
                    id="han_hoc_phi"
                    name="han_hoc_phi"
                    value={tempStudentData?.han_hoc_phi || ''}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Chương trình học</span>
                  <p className="font-medium flex items-center">
                    <BookOpen className="w-3 h-3 mr-1 text-muted-foreground" />
                    {student.ct_hoc || 'Chưa cập nhật'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Trường</span>
                  <p className="font-medium">{student.truong || 'Chưa cập nhật'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Lớp</span>
                  <p className="font-medium">{student.lop || 'Chưa cập nhật'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Nguồn đến</span>
                  <p className="font-medium">{student.nguon_den || 'Chưa cập nhật'}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Hạn học phí</span>
                  <p className="font-medium flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                    {student.han_hoc_phi ? format(new Date(student.han_hoc_phi), 'dd/MM/yyyy') : 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Thông tin liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dia_chi">Địa chỉ</Label>
                  <Input
                    id="dia_chi"
                    name="dia_chi"
                    value={tempStudentData?.dia_chi || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ten_ph">Tên phụ huynh</Label>
                  <Input
                    id="ten_ph"
                    name="ten_ph"
                    value={tempStudentData?.ten_ph || tempStudentData?.ten_PH || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="so_dien_thoai">Số điện thoại</Label>
                  <Input
                    id="so_dien_thoai"
                    name="so_dien_thoai"
                    value={tempStudentData?.so_dien_thoai || tempStudentData?.sdt_ph1 || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_ph1">Email</Label>
                  <Input
                    id="email_ph1"
                    name="email_ph1"
                    value={tempStudentData?.email_ph1 || ''}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Tên phụ huynh</span>
                  <p className="font-medium">{student.ten_ph || student.ten_PH || 'Chưa cập nhật'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Số điện thoại</span>
                  <p className="font-medium flex items-center">
                    <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                    {student.so_dien_thoai || student.sdt_ph1 || 'Chưa cập nhật'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="font-medium flex items-center">
                    <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                    {student.email_ph1 || 'Chưa cập nhật'}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Địa chỉ</span>
                  <p className="font-medium flex items-center">
                    <Home className="w-3 h-3 mr-1 text-muted-foreground" />
                    {student.dia_chi || 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Ghi chú & Thông tin khác
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="ghi_chu">Ghi chú</Label>
                <Textarea
                  id="ghi_chu"
                  name="ghi_chu"
                  value={tempStudentData?.ghi_chu || ''}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            ) : (
              <div>
                <span className="text-sm text-muted-foreground">Ghi chú</span>
                <p className="mt-1 whitespace-pre-wrap">{student.ghi_chu || 'Chưa có ghi chú'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentInfoTab;
