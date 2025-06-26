import { Teacher, PaginatedResponse, FilterParams, Class } from '../types';
import { httpClient } from './httpClient';

export interface TeacherService {
  getTeachers(params?: FilterParams): Promise<PaginatedResponse<Teacher>>;
  getTeacherById(id: string): Promise<Teacher>;
  createTeacher(data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<Teacher>;
  updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher>;
  deleteTeacher(id: string): Promise<void>;
  getTeacherClasses(teacherId: string): Promise<Class[]>;
}

class TeacherServiceImpl implements TeacherService {
  private readonly baseUrl = '/teachers';

  async getTeachers(params?: FilterParams): Promise<PaginatedResponse<Teacher>> {
    try {
      const response = await httpClient.get<PaginatedResponse<Teacher>>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      throw error;
    }
  }

  async getTeacherById(id: string): Promise<Teacher> {
    try {
      const response = await httpClient.get<Teacher>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch teacher ${id}:`, error);
      throw error;
    }
  }

  async createTeacher(data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<Teacher> {
    try {
      const response = await httpClient.post<Teacher>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create teacher:', error);
      throw error;
    }
  }

  async updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher> {
    try {
      const response = await httpClient.put<Teacher>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update teacher ${id}:`, error);
      throw error;
    }
  }

  async deleteTeacher(id: string): Promise<void> {
    try {
      await httpClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Failed to delete teacher ${id}:`, error);
      throw error;
    }
  }

  async getTeacherClasses(teacherId: string): Promise<Class[]> {
    try {
      const response = await httpClient.get<Class[]>(`${this.baseUrl}/${teacherId}/classes`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch classes for teacher ${teacherId}:`, error);
      throw error;
    }
  }
}

export const teacherService = new TeacherServiceImpl(); 