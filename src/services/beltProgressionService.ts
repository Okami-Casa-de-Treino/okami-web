import { 
  BeltPromotion, 
  BeltProgress, 
  BeltOverview, 
  PromoteStudentData, 
  PromotionResponse,
  PaginatedResponse,
  FilterParams,
  ApiResponse
} from '../types';
import { IBeltProgressionService, IApiService } from './interfaces';
import { httpClient } from './httpClient';

export class BeltProgressionService implements IBeltProgressionService {
  constructor(private apiService: IApiService) {}

  async getAllPromotions(params?: FilterParams): Promise<PaginatedResponse<BeltPromotion>> {
    const response = await this.apiService.get<PaginatedResponse<BeltPromotion>>('/belts/promotions', params);
    return response.data;
  }

  async getPromotionById(id: string): Promise<BeltPromotion> {
    const response = await this.apiService.get<BeltPromotion>(`/belts/promotions/${id}`);
    return response.data;
  }

  async promoteStudent(data: PromoteStudentData): Promise<PromotionResponse> {
    const response = await this.apiService.post<PromotionResponse>('/belts/promote', data);
    return response.data;
  }

  async getStudentProgress(studentId: string): Promise<BeltProgress> {
    const response = await this.apiService.get<BeltProgress>(`/students/${studentId}/belt-progress`);
    return response.data;
  }

  async getBeltOverview(): Promise<BeltOverview> {
    const response = await this.apiService.get<BeltOverview>('/belts/overview');
    return response.data;
  }
}

// Create service instance with dependency injection
export const beltProgressionService = new BeltProgressionService(httpClient);

// Export types for convenience
export type { BeltProgressionService };
export type BeltProgressionResponse = ApiResponse<BeltPromotion>;
export type BeltProgressResponse = ApiResponse<BeltProgress>;
export type BeltOverviewResponse = ApiResponse<BeltOverview>; 