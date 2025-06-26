
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { Session } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import DetailPanel from "@/components/ui/DetailPanel";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch sessions from the database
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching sessions:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách bài học",
          variant: "destructive"
        });
        setSessions([]);
      } else {
        console.log("Fetched sessions:", data);
        setSessions(data || []);
      }
      
    } catch (error) {
      console.error("Error in fetchSessions:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bài học",
        variant: "destructive"
      });
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (session: Session) => {
    setSelectedSession(session);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddClick = () => {
    // In a real app, this would navigate to a form to add a new session
    toast({
      title: "Thông báo",
      description: "Chức năng thêm bài học đang được phát triển",
    });
  };

  const columns = [
    {
      title: "Buổi Học Số",
      key: "buoi_hoc_so",
      sortable: true,
    },
    {
      title: "Nội Dung Bài Học",
      key: "noi_dung_bai_hoc",
    },
    {
      title: "Unit ID",
      key: "unit_id",
    },
    {
      title: "Ngày Tạo",
      key: "tg_tao",
      sortable: true,
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : '',
    }
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchSessions}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Bài Học
      </Button>
    </div>
  );

  return (
    <>
      {sessions.length === 0 && !isLoading ? (
        <PlaceholderPage
          title="Bài Học"
          description="Quản lý thông tin bài học"
          addButtonAction={handleAddClick}
        />
      ) : (
        <TablePageLayout
          title="Bài Học"
          description="Quản lý thông tin bài học"
          actions={tableActions}
        >
          <DataTable
            columns={columns}
            data={sessions}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            searchable={true}
            searchPlaceholder="Tìm kiếm bài học..."
          />
        </TablePageLayout>
      )}

      {selectedSession && (
        <DetailPanel
          title="Thông Tin Bài Học"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Buổi học số</h3>
              <p>{selectedSession.buoi_hoc_so}</p>
            </div>
            <div>
              <h3 className="font-medium">Nội dung bài học</h3>
              <p>{selectedSession.noi_dung_bai_hoc}</p>
            </div>
            {selectedSession.tsi_lesson_plan && (
              <div>
                <h3 className="font-medium">TSI Lesson Plan</h3>
                <p>{selectedSession.tsi_lesson_plan}</p>
              </div>
            )}
            {selectedSession.rep_lesson_plan && (
              <div>
                <h3 className="font-medium">REP Lesson Plan</h3>
                <p>{selectedSession.rep_lesson_plan}</p>
              </div>
            )}
            {selectedSession.bai_tap && (
              <div>
                <h3 className="font-medium">Bài tập</h3>
                <p>{selectedSession.bai_tap}</p>
              </div>
            )}
          </div>
        </DetailPanel>
      )}
    </>
  );
};

export default Sessions;
