import { Teacher, PaginatedResponse, FilterParams, Class, TeacherResponse } from '../types';
import { httpClient } from './httpClient';

export interface TeacherService {
  getTeachers(params?: FilterParams): Promise<PaginatedResponse<Teacher>>;
  getTeacherById(id: string): Promise<TeacherResponse>;
  createTeacher(data: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher>;
  updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher>;
  deleteTeacher(id: string): Promise<void>;
  getTeacherClasses(teacherId: string): Promise<Class[]>;
}

class TeacherServiceImpl implements TeacherService {
  private readonly baseUrl = '/teachers';

  async getTeachers(params?: FilterParams): Promise<PaginatedResponse<Teacher>> {
    const response = await httpClient.get<PaginatedResponse<Teacher>>(this.baseUrl, { params });
    return response.data;
  }

  async getTeacherById(id: string): Promise<TeacherResponse> {
    const response = await httpClient.get<TeacherResponse>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createTeacher(data: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher> {
    const response = await httpClient.post<Teacher>(this.baseUrl, data);
    return response.data;
  }

  async updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher> {
    const response = await httpClient.put<Teacher>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteTeacher(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }

  async getTeacherClasses(teacherId: string): Promise<Class[]> {
    const response = await httpClient.get<Class[]>(`${this.baseUrl}/${teacherId}/classes`);
    return response.data;
  }
}

export const teacherService = new TeacherServiceImpl(); 