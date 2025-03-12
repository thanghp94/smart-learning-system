
import React, { useState } from 'react';
import { Candidate, CandidateStatus } from '@/lib/supabase/recruitment-service';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import EmailButton from '@/components/common/EmailButton';
import { Edit, FileText, Link as LinkIcon, MapPin, Phone, Mail, Calendar, GraduationCap, Briefcase } from 'lucide-react';

interface CandidateDetailProps {
  candidate: Candidate;
  onEdit: () => void;
  onClose: () => void;
}

const STATUS_LABELS: Record<CandidateStatus, string> = {
  new_application: 'Hồ sơ mới',
  cv_reviewing: 'Đang xem xét CV',
  interview_scheduled: 'Đã lên lịch phỏng vấn',
  passed_interview: 'Đã qua phỏng vấn',
  offer_sent: 'Đã gửi đề nghị',
  hired: 'Đã tuyển',
  rejected: 'Từ chối'
};

const STATUS_VARIANTS: Record<CandidateStatus, string> = {
  new_application: 'default',
  cv_reviewing: 'secondary',
  interview_scheduled: 'default',
  passed_interview: 'success',
  offer_sent: 'warning',
  hired: 'success',
  rejected: 'destructive'
};

const CandidateDetail: React.FC<CandidateDetailProps> = ({
  candidate,
  onEdit,
  onClose,
}) => {
  const [tab, setTab] = useState('info');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{candidate.full_name}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant={STATUS_VARIANTS[candidate.current_status] as any}>
              {STATUS_LABELS[candidate.current_status]}
            </Badge>
            {candidate.position_title && (
              <span className="text-muted-foreground">
                {candidate.position_title}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <EmailButton
            recipientEmail={candidate.email}
            recipientName={candidate.full_name}
            recipientType="candidate"
          />
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="cv">CV & Hồ sơ</TabsTrigger>
          <TabsTrigger value="notes">Ghi chú</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Thông tin liên hệ</h3>
                
                <div className="space-y-2">
                  {candidate.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{candidate.email}</span>
                    </div>
                  )}
                  
                  {candidate.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{candidate.phone}</span>
                    </div>
                  )}
                  
                  {candidate.address && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{candidate.address}</span>
                    </div>
                  )}
                  
                  {candidate.birth_date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Ngày sinh: {format(new Date(candidate.birth_date), 'dd/MM/yyyy')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Thông tin nghề nghiệp</h3>
                
                <div className="space-y-2">
                  {candidate.current_position && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Vị trí hiện tại: {candidate.current_position}</span>
                    </div>
                  )}
                  
                  {candidate.years_of_experience !== undefined && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Kinh nghiệm: {candidate.years_of_experience} năm</span>
                    </div>
                  )}
                  
                  {candidate.education_level && (
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Trình độ học vấn: {candidate.education_level}</span>
                    </div>
                  )}
                  
                  {candidate.skills && candidate.skills.length > 0 && (
                    <div>
                      <div className="flex items-center mb-2">
                        <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Kỹ năng:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 ml-6">
                        {candidate.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cv" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">CV & Tài liệu</h3>
              
              <div className="space-y-2">
                {candidate.cv_path && (
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={candidate.cv_path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Xem CV
                    </a>
                  </div>
                )}
                
                {candidate.linkedin_url && (
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={candidate.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
                
                {candidate.portfolio_url && (
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={candidate.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Portfolio
                    </a>
                  </div>
                )}
                
                {!candidate.cv_path && !candidate.linkedin_url && !candidate.portfolio_url && (
                  <p className="text-muted-foreground italic">Không có tài liệu</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Ghi chú</h3>
              
              {candidate.notes ? (
                <p className="whitespace-pre-wrap">{candidate.notes}</p>
              ) : (
                <p className="text-muted-foreground italic">Không có ghi chú</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default CandidateDetail;
