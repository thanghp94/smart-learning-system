
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KanbanView from './KanbanView';
import CandidatesTable from './components/CandidatesTable';
import PositionsTable from './components/PositionsTable';
import { Button } from '@/components/ui/button';
import { UserPlus, Briefcase } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CandidateForm from './components/CandidateForm';
import PositionForm from './components/PositionForm';

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState('kanban');
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const handleAddCandidate = () => {
    setSelectedCandidate(null);
    setShowCandidateForm(true);
  };

  const handleEditCandidate = (id: string) => {
    setSelectedCandidate(id);
    setShowCandidateForm(true);
  };

  const handleAddPosition = () => {
    setSelectedPosition(null);
    setShowPositionForm(true);
  };

  const handleEditPosition = (id: string) => {
    setSelectedPosition(id);
    setShowPositionForm(true);
  };

  const handleCloseForm = () => {
    setShowCandidateForm(false);
    setShowPositionForm(false);
    setSelectedCandidate(null);
    setSelectedPosition(null);
  };

  const handleFormSubmit = () => {
    handleCloseForm();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tuyển dụng</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddCandidate}>
            <UserPlus className="mr-2 h-4 w-4" />
            Thêm ứng viên
          </Button>
          <Button variant="outline" onClick={handleAddPosition}>
            <Briefcase className="mr-2 h-4 w-4" />
            Thêm vị trí
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kanban">Bảng Kanban</TabsTrigger>
          <TabsTrigger value="candidates">Danh sách ứng viên</TabsTrigger>
          <TabsTrigger value="positions">Vị trí tuyển dụng</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <KanbanView onCandidateEdit={handleEditCandidate} />
        </TabsContent>
        <TabsContent value="candidates">
          <CandidatesTable 
            onRowClick={handleEditCandidate} 
            onAddClick={handleAddCandidate} 
          />
        </TabsContent>
        <TabsContent value="positions">
          <PositionsTable 
            onRowClick={handleEditPosition} 
            onAddClick={handleAddPosition} 
          />
        </TabsContent>
      </Tabs>

      {/* Candidate Form Dialog */}
      <Dialog open={showCandidateForm} onOpenChange={setShowCandidateForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCandidate ? 'Chỉnh sửa ứng viên' : 'Thêm ứng viên mới'}
            </DialogTitle>
          </DialogHeader>
          <CandidateForm 
            candidateId={selectedCandidate || undefined} 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseForm} 
          />
        </DialogContent>
      </Dialog>

      {/* Position Form Dialog */}
      <Dialog open={showPositionForm} onOpenChange={setShowPositionForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPosition ? 'Chỉnh sửa vị trí' : 'Thêm vị trí mới'}
            </DialogTitle>
          </DialogHeader>
          <PositionForm 
            positionId={selectedPosition || undefined} 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseForm} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recruitment;
