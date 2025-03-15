
import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  studentService, 
  employeeService, 
  contactService, 
  facilityService, 
  assetService, 
  eventService,
  enrollmentService,
  classService
} from '@/lib/supabase';
import { Student, Employee, Contact, Facility, Asset, Enrollment } from '@/lib/types';
import { UseFormReturn } from 'react-hook-form';

interface EntitySelectProps {
  form: UseFormReturn<any>;
  selectedEntityType: string | null;
  onEntityTypeChange: (value: string) => void;
  onEntityNameChange?: (entityId: string, entityName: string) => void;
  facilities?: Facility[];
}

const EntitySelect: React.FC<EntitySelectProps> = ({
  form,
  selectedEntityType,
  onEntityTypeChange,
  onEntityNameChange,
  facilities = [],
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load related entities when the form loads or entity type changes
  useEffect(() => {
    const loadEntities = async () => {
      setIsLoading(true);
      try {
        if (selectedEntityType === 'student' || !selectedEntityType) {
          const data = await studentService.getAll();
          setStudents(data);
        }
        
        if (selectedEntityType === 'employee' || !selectedEntityType) {
          const data = await employeeService.getAll();
          setEmployees(data);
        }
        
        if (selectedEntityType === 'contact' || !selectedEntityType) {
          const data = await contactService.getAll();
          setContacts(data);
        }
        
        if (selectedEntityType === 'asset' || !selectedEntityType) {
          const data = await assetService.getAll();
          setAssets(data);
        }
        
        if (selectedEntityType === 'event' || !selectedEntityType) {
          const data = await eventService.getAll();
          setEvents(data);
        }
        
        if (selectedEntityType === 'enrollment' || !selectedEntityType) {
          const data = await enrollmentService.getAll();
          setEnrollments(data);
        }
        
        if (selectedEntityType === 'class' || !selectedEntityType) {
          const data = await classService.getAll();
          setClasses(data);
        }
      } catch (error) {
        console.error('Error loading entity data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntities();
  }, [selectedEntityType]);

  // Handle entity selection
  const handleEntitySelection = (entityId: string, entityName: string) => {
    form.setValue('doi_tuong_id', entityId);
    if (onEntityNameChange) {
      onEntityNameChange(entityId, entityName);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="loai_doi_tuong"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại đối tượng</FormLabel>
            <Select 
              onValueChange={(value) => onEntityTypeChange(value)} 
              defaultValue={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại đối tượng" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="student">Học sinh</SelectItem>
                <SelectItem value="employee">Nhân viên</SelectItem>
                <SelectItem value="contact">Liên hệ</SelectItem>
                <SelectItem value="facility">Cơ sở</SelectItem>
                <SelectItem value="asset">Tài sản</SelectItem>
                <SelectItem value="event">Sự kiện</SelectItem>
                <SelectItem value="enrollment">Ghi danh</SelectItem>
                <SelectItem value="class">Lớp học</SelectItem>
                <SelectItem value="government">Cơ quan nhà nước</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedEntityType && (
        <FormField
          control={form.control}
          name="doi_tuong_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đối tượng</FormLabel>
              <Select 
                onValueChange={(value) => {
                  // Find the entity name based on the selected ID and entity type
                  let entityName = '';
                  
                  if (selectedEntityType === 'student') {
                    const student = students.find(s => s.id === value);
                    entityName = student?.ten_hoc_sinh || '';
                  } else if (selectedEntityType === 'employee') {
                    const employee = employees.find(e => e.id === value);
                    entityName = employee?.ten_nhan_su || '';
                  } else if (selectedEntityType === 'contact') {
                    const contact = contacts.find(c => c.id === value);
                    entityName = contact?.ten_lien_he || '';
                  } else if (selectedEntityType === 'facility') {
                    const facility = facilities.find(f => f.id === value);
                    entityName = facility?.ten_co_so || '';
                  } else if (selectedEntityType === 'asset') {
                    const asset = assets.find(a => a.id === value);
                    entityName = asset?.ten_csvc || '';
                    if (asset?.loai) {
                      entityName += ` (${asset.loai})`;
                    }
                  } else if (selectedEntityType === 'event') {
                    const event = events.find(e => e.id === value);
                    entityName = event?.ten_su_kien || '';
                  } else if (selectedEntityType === 'enrollment') {
                    const enrollment = enrollments.find(e => e.id === value);
                    const studentName = enrollment?.ten_hoc_sinh || '';
                    const className = enrollment?.ten_lop_full || enrollment?.ten_lop || '';
                    const program = enrollment?.ct_hoc || '';
                    
                    entityName = `${studentName} - ${className}${program ? ` (${program})` : ''}`;
                  } else if (selectedEntityType === 'class') {
                    const classItem = classes.find(c => c.id === value);
                    entityName = classItem?.ten_lop_full || classItem?.ten_lop || '';
                    if (classItem?.ct_hoc) {
                      entityName += ` (${classItem.ct_hoc})`;
                    }
                  } else if (selectedEntityType === 'government') {
                    entityName = 'Cơ quan nhà nước';
                  }
                  
                  handleEntitySelection(value, entityName);
                }} 
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn đối tượng"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedEntityType === 'student' &&
                    students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.ten_hoc_sinh}
                      </SelectItem>
                    ))}
                  
                  {selectedEntityType === 'employee' &&
                    employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.ten_nhan_su}
                      </SelectItem>
                    ))}
                  
                  {selectedEntityType === 'contact' &&
                    contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.ten_lien_he}
                      </SelectItem>
                    ))}
                    
                  {selectedEntityType === 'facility' &&
                    facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.ten_co_so}
                      </SelectItem>
                    ))}
                    
                  {selectedEntityType === 'asset' &&
                    assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.ten_csvc} {asset.loai ? `(${asset.loai})` : ''}
                      </SelectItem>
                    ))}
                    
                  {selectedEntityType === 'event' &&
                    events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.ten_su_kien}
                      </SelectItem>
                    ))}
                  
                  {selectedEntityType === 'enrollment' &&
                    enrollments.map((enrollment) => (
                      <SelectItem key={enrollment.id} value={enrollment.id}>
                        {enrollment.ten_hoc_sinh} - {enrollment.ten_lop_full || enrollment.ten_lop || 'Không có thông tin lớp'} {enrollment.ct_hoc ? `(${enrollment.ct_hoc})` : ''}
                      </SelectItem>
                    ))}
                  
                  {selectedEntityType === 'class' &&
                    classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.ten_lop_full || cls.ten_lop} {cls.ct_hoc ? `(${cls.ct_hoc})` : ''}
                      </SelectItem>
                    ))}
                    
                  {selectedEntityType === 'government' &&
                    <SelectItem value="government">Cơ quan nhà nước</SelectItem>
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default EntitySelect;
