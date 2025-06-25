import { Student, PaginatedResponse, FilterParams } from '../types';
import { httpClient } from './httpClient';

export interface StudentService {
  getStudents(params?: FilterParams): Promise<PaginatedResponse<Student>>;
  getStudentById(id: string): Promise<Student>;
  createStudent(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student>;
  updateStudent(id: string, data: Partial<Student>): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
  enrollInClass(studentId: string, classId: string): Promise<void>;
  unenrollFromClass(studentId: string, classId: string): Promise<void>;
  getStudentClasses(studentId: string): Promise<unknown[]>;
}

class StudentServiceImpl implements StudentService {
  private readonly baseUrl = '/students';

  async getStudents(params?: FilterParams): Promise<PaginatedResponse<Student>> {
    try {
      const response = await httpClient.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  }

  async getStudentById(id: string): Promise<Student> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch student ${id}:`, error);
      throw error;
    }
  }

  async createStudent(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    try {
      const response = await httpClient.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create student:', error);
      throw error;
    }
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    try {
      const response = await httpClient.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update student ${id}:`, error);
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      await httpClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Failed to delete student ${id}:`, error);
      throw error;
    }
  }

  async enrollInClass(studentId: string, classId: string): Promise<void> {
    try {
      await httpClient.post(`${this.baseUrl}/${studentId}/enroll`, { 
        class_id: classId
      });
    } catch (error) {
      console.error(`Failed to enroll student ${studentId} in class ${classId}:`, error);
      throw error;
    }
  }

  async unenrollFromClass(studentId: string, classId: string): Promise<void> {
    try {
      await httpClient.post(`${this.baseUrl}/${studentId}/unenroll`, { 
        class_id: classId
      });
    } catch (error) {
      console.error(`Failed to unenroll student ${studentId} from class ${classId}:`, error);
      throw error;
    }
  }

  async getStudentClasses(studentId: string): Promise<unknown[]> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/${studentId}/classes`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch classes for student ${studentId}:`, error);
      throw error;
    }
  }
}

export const studentService: StudentService = new StudentServiceImpl(); 