import { Checkin, PaginatedResponse, FilterParams, ApiResponse } from '../types';
import { httpClient } from './httpClient';
import { ICheckinService } from '../types/interfaces';

export interface CheckinResponse {
  data: Checkin;
  success: boolean;
}

export interface CheckinCreateData {
  student_id: string;
  class_id: string;
  type: 'manual' | 'qr_code' | 'app';
  notes?: string;
}

class CheckinServiceImpl implements ICheckinService {
  private readonly baseUrl = '/checkins';

  async getAll(params?: FilterParams): Promise<PaginatedResponse<Checkin>> {
    const response = await httpClient.get<PaginatedResponse<Checkin>>(this.baseUrl, { params });
    return response.data;
  }

  async create(checkinData: Omit<Checkin, 'id' | 'created_at'>): Promise<Checkin> {
    const response = await httpClient.post<CheckinResponse>(this.baseUrl, checkinData);
    return response.data.data;
  }

  async getTodayCheckins(): Promise<Checkin[]> {
    const response = await httpClient.get<ApiResponse<Checkin[]>>(`${this.baseUrl}/today`);
    return response.data.data;
  }

  async getByStudent(studentId: string): Promise<Checkin[]> {
    const response = await httpClient.get<ApiResponse<Checkin[]>>(`${this.baseUrl}/student/${studentId}`);
    return response.data.data;
  }

  async getByClass(classId: string): Promise<Checkin[]> {
    const response = await httpClient.get<ApiResponse<Checkin[]>>(`${this.baseUrl}/class/${classId}`);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const checkinService = new CheckinServiceImpl(); 