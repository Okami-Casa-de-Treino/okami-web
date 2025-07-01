import { Student, StudentClass, PaginatedResponse, FilterParams } from '../types';
import { httpClient } from './httpClient';

export interface StudentService {
  getStudents(params?: FilterParams): Promise<PaginatedResponse<Student>>;
  getStudentById(id: string): Promise<Student>;
  createStudent(data: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student>;
  updateStudent(id: string, data: Partial<Student>): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
  enrollInClass(studentId: string, classId: string): Promise<void>;
  unenrollFromClass(studentId: string, classId: string): Promise<void>;
  getStudentClasses(studentId: string): Promise<StudentClass[]>;
}

class StudentServiceImpl implements StudentService {
  private readonly baseUrl = '/students';

  async getStudents(params?: FilterParams): Promise<PaginatedResponse<Student>> {
    const response = await httpClient.get<PaginatedResponse<Student>>(this.baseUrl, { params });
    return response.data;
  }

  async getStudentById(id: string): Promise<Student> {
    const response = await httpClient.get<Student>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createStudent(data: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    const response = await httpClient.post<Student>(this.baseUrl, data);
    return response.data;
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const response = await httpClient.put<Student>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteStudent(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }

  async enrollInClass(studentId: string, classId: string): Promise<void> {
    await httpClient.post(`${this.baseUrl}/${studentId}/classes`, { 
      class_id: classId
    });
  }

  async unenrollFromClass(studentId: string, classId: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${studentId}/classes/${classId}`);
  }

  async getStudentClasses(studentId: string): Promise<StudentClass[]> {
    const response = await httpClient.get<{ success: boolean; data: StudentClass[] }>(`${this.baseUrl}/${studentId}/classes`);
    return response.data.data;
  }
}

export const studentService: StudentService = new StudentServiceImpl(); 