
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { positionService } from '@/lib/supabase/position-service';
import { candidateService } from '@/lib/supabase/candidate-service';
import { Candidate, CandidateStatus, Position } from '@/lib/types/recruitment';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  position_id: z.string().optional(),
  resume_url: z.string().optional(),
  status: z.enum([
    CandidateStatus.NEW,
    CandidateStatus.SCREENING,
    CandidateStatus.INTERVIEW,
    CandidateStatus.OFFER,
    CandidateStatus.HIRED,
    CandidateStatus.REJECTED
  ]),
  interview_date: z.date().optional().nullable(),
  notes: z.string().optional(),
});

export interface CandidateFormProps {
  candidateId?: string;
  initialData?: Partial<Candidate>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({
  candidateId,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await positionService.getActive();
        setPositions(data);
      } catch (error) {
        console.error('Error fetching positions:', error);
        toast({
          title: 'Error',
          description: 'Could not load positions',
          variant: 'destructive',
        });
      }
    };

    const fetchCandidate = async () => {
      if (!candidateId) return;
      
      try {
        setIsLoading(true);
        const data = await candidateService.getById(candidateId);
        if (data) {
          form.reset({
            name: data.name,
            email: data.email,
            phone: data.phone,
            position_id: data.position_id,
            resume_url: data.resume_url || '',
            status: data.status,
            interview_date: data.interview_date ? new Date(data.interview_date) : null,
            notes: data.notes || '',
          });
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
        toast({
          title: 'Error',
          description: 'Could not load candidate data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
    fetchCandidate();
  }, [candidateId, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      position_id: initialData?.position_id || '',
      resume_url: initialData?.resume_url || '',
      status: initialData?.status || CandidateStatus.NEW,
      interview_date: initialData?.interview_date ? new Date(initialData.interview_date) : null,
      notes: initialData?.notes || '',
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter candidate name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="position_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CandidateStatus.NEW}>New</SelectItem>
                    <SelectItem value={CandidateStatus.SCREENING}>Screening</SelectItem>
                    <SelectItem value={CandidateStatus.INTERVIEW}>Interview</SelectItem>
                    <SelectItem value={CandidateStatus.OFFER}>Offer</SelectItem>
                    <SelectItem value={CandidateStatus.HIRED}>Hired</SelectItem>
                    <SelectItem value={CandidateStatus.REJECTED}>Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="interview_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Interview Date</FormLabel>
              <DatePicker 
                date={field.value || undefined} 
                setDate={field.onChange}
                placeholder="Select interview date"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter resume URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add notes about the candidate"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Candidate</Button>
        </div>
      </form>
    </Form>
  );
};

export default CandidateForm;
