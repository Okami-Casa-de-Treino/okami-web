import { IStudentService, IApiService } from './interfaces';
import { Student, Checkin, Payment, Class, PaginatedResponse, FilterParams } from '../types';

export class StudentService implements IStudentService {
  constructor(private apiService: IApiService) {}

  async getAll(params?: FilterParams): Promise<PaginatedResponse<Student>> {
    const response = await this.apiService.get<PaginatedResponse<Student>>('/students', params);
    return response.data;
  }

  async getById(id: string): Promise<Student> {
    const response = await this.apiService.get<Student>(`/students/${id}`);
    return response.data;
  }

  async create(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    const response = await this.apiService.post<Student>('/students', student);
    return response.data;
  }

  async update(id: string, student: Partial<Student>): Promise<Student> {
    const response = await this.apiService.put<Student>(`/students/${id}`, student);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete(`/students/${id}`);
  }

  async getCheckins(id: string): Promise<Checkin[]> {
    const response = await this.apiService.get<Checkin[]>(`/students/${id}/checkins`);
    return response.data;
  }

  async getPayments(id: string): Promise<Payment[]> {
    const response = await this.apiService.get<Payment[]>(`/students/${id}/payments`);
    return response.data;
  }

  async getClasses(id: string): Promise<Class[]> {
    const response = await this.apiService.get<Class[]>(`/students/${id}/classes`);
    return response.data;
  }

  async enrollInClass(studentId: string, classId: string): Promise<void> {
    await this.apiService.post(`/students/${studentId}/classes`, { classId });
  }

  async unenrollFromClass(studentId: string, classId: string): Promise<void> {
    await this.apiService.delete(`/students/${studentId}/classes/${classId}`);
  }
} 