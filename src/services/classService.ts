import { Class, PaginatedResponse, FilterParams, Student, Checkin, ApiResponse } from '../types';
import { httpClient } from './httpClient';
import { IClassService } from '../types/interfaces';
import { StudentEnrollment } from '../pages/shared/ClassDetails/types';

export interface ClassResponse {
  data: Class;
  success: boolean;
}

export interface ScheduleResponse {
  schedule: Record<string, Class[]>;
  summary: {
    total_classes: number;
    days_with_classes: number;
    teachers_count: number;
  };
}

class ClassServiceImpl implements IClassService {
  private readonly baseUrl = '/classes';

  async getAll(params?: FilterParams): Promise<PaginatedResponse<Class>> {
    const response = await httpClient.get<PaginatedResponse<Class>>(this.baseUrl, { params });
    return response.data;
  }

  async getById(id: string): Promise<Class> {
    const response = await httpClient.get<ClassResponse>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async create(classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>): Promise<Class> {
    const response = await httpClient.post<ClassResponse>(this.baseUrl, classData);
    return response.data.data;
  }

  async update(id: string, classData: Partial<Class>): Promise<Class> {
    const response = await httpClient.put<ClassResponse>(`${this.baseUrl}/${id}`, classData);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }

  async getStudents(id: string): Promise<StudentEnrollment[]> {
    const response = await httpClient.get<ApiResponse<StudentEnrollment[]>>(`${this.baseUrl}/${id}/students`);
    return response.data.data;
  }

  async getCheckins(id: string): Promise<Checkin[]> {
    const response = await httpClient.get<ApiResponse<Checkin[]>>(`${this.baseUrl}/${id}/checkins`);
    return response.data.data;
  }

  async getSchedule(): Promise<Record<string, Class[]>> {
    const response = await httpClient.get<ApiResponse<ScheduleResponse>>(`${this.baseUrl}/schedule`);
    return response.data.data.schedule;
  }
}

export const classService = new ClassServiceImpl(); 