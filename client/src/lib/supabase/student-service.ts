import { Student } from '@/lib/types';

class StudentService {
  private apiUrl = '/api';

  // Core CRUD operations

  async getAll(): Promise<Student[]> {
    console.log('Fetching all students...');
    try {
      const response = await fetch(`${this.apiUrl}/students`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Successfully fetched ${data?.length || 0} students`);
      return this.normalizeStudentData(data || []);
    } catch (error) {
      console.error('Error in fetchStudents:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Student | null> {
    try {
      const response = await fetch(`${this.apiUrl}/students/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data) return null;

      return this.normalizeStudentData([data])[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  async create(studentData: Omit<Student, 'id'> & { id?: string }): Promise<Student | null> {
    try {
      console.log('Creating new student:', studentData);

      const response = await fetch(`${this.apiUrl}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Student created successfully:', data);

      return data as Student;
    } catch (error) {
      console.error('Error in createStudent:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Student>): Promise<Student | null> {
    try {
      console.log('Updating student:', id, updates);

      const response = await fetch(`${this.apiUrl}/students/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Student updated successfully:', data);

      return data as Student;
    } catch (error) {
      console.error('Error in updateStudent:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/students/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Student not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Student deleted successfully:', id);
    } catch (error) {
      console.error('Error in deleteStudent:', error);
      throw error;
    }
  }

  // Specialized query methods

  async getByFacility(facilityId: string): Promise<Student[]> {
    try {
      const response = await fetch(`${this.apiUrl}/students?facility_id=${facilityId}`);
      if (!response.ok) {
        console.error('Error fetching students by facility');
        return [];
      }

      const data = await response.json();
      return this.normalizeStudentData(data || []);
    } catch (error) {
      console.error('Error in fetchStudentsByFacility:', error);
      return [];
    }
  }

  async getByClass(classId: string): Promise<Student[]> {
    try {
      // First get enrollments for this class
      const enrollmentResponse = await fetch(`${this.apiUrl}/enrollments?class_id=${classId}`);
      if (!enrollmentResponse.ok) {
        console.error('Error fetching enrollments');
        return [];
      }

      const enrollments = await enrollmentResponse.json();
      if (!enrollments || enrollments.length === 0) {
        return [];
      }

      // Get unique student IDs
      const studentIds = [...new Set(enrollments.map((enrollment: any) => enrollment.hoc_sinh_id))];

      // Fetch all students and filter by IDs
      const allStudents = await this.getAll();
      return allStudents.filter(student => studentIds.includes(student.id));
    } catch (error) {
      console.error('Error in fetchStudentsByClass:', error);
      return [];
    }
  }

  // Helper methods for data normalization

  private normalizeStudentData(students: any[]): Student[] {
    return students.map(student => ({
      ...student,
      id: student.id || crypto.randomUUID(),
      co_so_id: student.co_so_id || '',
      ten_hoc_sinh: student.ten_hoc_sinh || '',
      email: student.email || student.email_ph1 || ''
    }));
  }
}

export const studentService = new StudentService();