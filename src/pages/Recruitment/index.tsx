import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PageHeader from '@/components/common/PageHeader';
import CandidateForm from './components/CandidateForm';
import { candidateService } from '@/lib/supabase/candidate-service';
import { Candidate, CandidateStatus } from '@/lib/types/recruitment';

const Recruitment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editCandidateId, setEditCandidateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getAll();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load candidates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = () => {
    setShowAddDialog(true);
  };

  const handleEditCandidate = (id: string) => {
    setEditCandidateId(id);
  };

  const handleSubmitAdd = async (data: any) => {
    try {
      await candidateService.create(data);
      toast({
        title: 'Success',
        description: 'Candidate added successfully',
      });
      setShowAddDialog(false);
      fetchCandidates();
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast({
        title: 'Error',
        description: 'Failed to add candidate',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitEdit = async (data: any) => {
    if (!editCandidateId) return;
    
    try {
      await candidateService.update(editCandidateId, data);
      toast({
        title: 'Success',
        description: 'Candidate updated successfully',
      });
      setEditCandidateId(null);
      fetchCandidates();
    } catch (error) {
      console.error('Error updating candidate:', error);
      toast({
        title: 'Error',
        description: 'Failed to update candidate',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setShowAddDialog(false);
    setEditCandidateId(null);
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Recruitment"
        description="Manage candidates and job applications"
        action={{
          label: "Add Candidate",
          onClick: handleAddCandidate
        }}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Candidates</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="screening">Screening</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="offer">Offer</TabsTrigger>
          <TabsTrigger value="hired">Hired</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {/* Candidate table or list would go here */}
          <p>Content for All Candidates tab</p>
        </TabsContent>
        
        <TabsContent value="new">
          {/* New candidates would go here */}
          <p>Content for New tab</p>
        </TabsContent>
        
        <TabsContent value="screening">
          <p>Content for Screening tab</p>
        </TabsContent>
        
        <TabsContent value="interview">
          <p>Content for Interview tab</p>
        </TabsContent>
        
        <TabsContent value="offer">
          <p>Content for Offer tab</p>
        </TabsContent>
        
        <TabsContent value="hired">
          <p>Content for Hired tab</p>
        </TabsContent>
      </Tabs>
      
      {/* Add Candidate Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <CandidateForm
            onSubmit={handleSubmitAdd}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Candidate Dialog */}
      <Dialog open={!!editCandidateId} onOpenChange={(open) => !open && setEditCandidateId(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {editCandidateId && (
            <CandidateForm
              candidateId={editCandidateId}
              onSubmit={handleSubmitEdit}
              onCancel={handleCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recruitment;
