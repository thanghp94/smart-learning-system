
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, Calendar, Clock, User, MapPin, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface OverviewTabProps {
  sessionData: any;
  notes: string;
  editingNotes: boolean;
  isSaving: boolean;
  setNotes: (notes: string) => void;
  setEditingNotes: (editing: boolean) => void;
  handleSaveNotes: () => Promise<void>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  sessionData,
  notes,
  editingNotes,
  isSaving,
  setNotes,
  setEditingNotes,
  handleSaveNotes
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin buổi học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Ngày:</span>
              <span className="text-sm">
                {sessionData.ngay_hoc ? format(new Date(sessionData.ngay_hoc), 'dd/MM/yyyy') : 'Chưa cập nhật'}
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Thời gian:</span>
              <span className="text-sm">
                {sessionData.thoi_gian_bat_dau && sessionData.thoi_gian_ket_thuc 
                  ? `${sessionData.thoi_gian_bat_dau.substring(0, 5)} - ${sessionData.thoi_gian_ket_thuc.substring(0, 5)}`
                  : 'Chưa cập nhật'}
              </span>
            </div>
            
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Trợ giảng:</span>
              <span className="text-sm">{sessionData.tro_giang || 'Không có'}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Phòng học:</span>
              <span className="text-sm">{sessionData.phong_hoc_id || 'Chưa chỉ định'}</span>
            </div>
            
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Loại bài học:</span>
              <Badge variant="outline">{sessionData.loai_bai_hoc || 'Học mới'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Ghi chú</CardTitle>
          {!editingNotes && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setEditingNotes(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Chỉnh sửa
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editingNotes ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú cho buổi học này..."
              rows={6}
            />
          ) : (
            <div className="min-h-[100px] text-sm">
              {notes ? notes : (
                <span className="text-muted-foreground italic">Chưa có ghi chú cho buổi học này</span>
              )}
            </div>
          )}
        </CardContent>
        {editingNotes && (
          <CardFooter className="flex justify-end space-x-2 pt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setNotes(sessionData.ghi_chu || '');
                setEditingNotes(false);
              }}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button 
              size="sm" 
              onClick={handleSaveNotes}
              disabled={isSaving}
            >
              {isSaving ? 'Đang lưu...' : (
                <>
                  <Save className="h-4 w-4 mr-1" /> Lưu
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {sessionData.nhan_xet_chung && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Nhận xét chung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{sessionData.nhan_xet_chung}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTab;
