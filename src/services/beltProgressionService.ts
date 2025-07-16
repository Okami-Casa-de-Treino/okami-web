import { 
  BeltPromotion, 
  BeltProgress, 
  BeltOverview, 
  PromoteStudentData, 
  UpdatePromotionData,
  PromotionResponse,
  PaginatedResponse,
  FilterParams,
  ApiResponse
} from '../types';
import { IBeltProgressionService } from '../types/interfaces';
import { httpClient } from './httpClient';

export class BeltProgressionService implements IBeltProgressionService {
  async getAllPromotions(params?: FilterParams): Promise<PaginatedResponse<BeltPromotion>> {
    const response = await httpClient.get<PaginatedResponse<BeltPromotion>>('/belts/promotions', { params });
    return response.data;
  }

  async getPromotionById(id: string): Promise<BeltPromotion> {
    const response = await httpClient.get<BeltPromotion>(`/belts/promotions/${id}`);
    return response.data;
  }

  async promoteStudent(data: PromoteStudentData): Promise<PromotionResponse> {
    const response = await httpClient.post<PromotionResponse>('/belts/promote', data);
    return response.data;
  }

  async updatePromotion(id: string, data: UpdatePromotionData): Promise<BeltPromotion> {
    const response = await httpClient.put<BeltPromotion>(`/belts/promotions/${id}`, data);
    return response.data;
  }

  async deletePromotion(id: string): Promise<void> {
    await httpClient.delete(`/belts/promotions/${id}`);
  }

  async getStudentProgress(studentId: string): Promise<BeltProgress> {
    const response = await httpClient.get<BeltProgress>(`/students/${studentId}/belt-progress`);
    return response.data;
  }

  async getBeltOverview(): Promise<ApiResponse<BeltOverview>> {
    const response = await httpClient.get<ApiResponse<BeltOverview>>('/belts/overview');
    return response.data;
  }
}

// Create service instance
export const beltProgressionService = new BeltProgressionService();

// Export types for convenience
export type BeltProgressionResponse = ApiResponse<BeltPromotion>;
export type BeltProgressResponse = ApiResponse<BeltProgress>;
export type BeltOverviewResponse = ApiResponse<BeltOverview>; 