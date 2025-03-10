
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Save } from 'lucide-react';

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
  handleSaveNotes,
}) => {
  return (
    <div className="grid gap-6 grid-cols-1">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Nội dung buổi học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {sessionData?.noi_dung || sessionData?.content || 'Chưa có nội dung cho buổi học này.'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ghi chú</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => editingNotes ? handleSaveNotes() : setEditingNotes(true)}
            disabled={isSaving}
          >
            {editingNotes ? (
              <Save className="h-4 w-4 mr-1" />
            ) : (
              <Edit2 className="h-4 w-4 mr-1" />
            )}
            {editingNotes ? 'Lưu' : 'Sửa'}
          </Button>
        </CardHeader>
        <CardContent>
          {editingNotes ? (
            <div className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú về buổi học..."
                rows={5}
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNotes(sessionData?.ghi_chu || '');
                    setEditingNotes(false);
                  }}
                  disabled={isSaving}
                >
                  Hủy
                </Button>
                <Button 
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu ghi chú'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              {notes || 'Chưa có ghi chú nào.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
