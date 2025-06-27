import { Payment, PaginatedResponse, FilterParams, ApiResponse } from '../types';
import { httpClient } from './httpClient';
import { IPaymentService } from './interfaces';

export interface PaymentResponse {
  data: Payment;
  success: boolean;
}

export interface PaymentCreateData {
  studentId: string;
  amount: number;
  dueDate: string;
  referenceMonth: string;
  discount?: number;
  notes?: string;
  type?: 'monthly' | 'enrollment' | 'other';
}

export interface MarkAsPaidData {
  payment_method: 'cash' | 'card' | 'pix' | 'bank_transfer';
  payment_date?: string;
}

class PaymentServiceImpl implements IPaymentService {
  private readonly baseUrl = '/payments';

  async getAll(params?: FilterParams): Promise<PaginatedResponse<Payment>> {
    const response = await httpClient.get<PaginatedResponse<Payment>>(this.baseUrl, { params });
    return response.data;
  }

  async getById(id: string): Promise<Payment> {
    const response = await httpClient.get<PaymentResponse>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async create(paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const response = await httpClient.post<PaymentResponse>(this.baseUrl, paymentData);
    return response.data.data;
  }

  async update(id: string, paymentData: Partial<Payment>): Promise<Payment> {
    const response = await httpClient.put<PaymentResponse>(`${this.baseUrl}/${id}`, paymentData);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }

  async markAsPaid(id: string, paymentMethod: string, paymentDate?: string): Promise<Payment> {
    const data: MarkAsPaidData = {
      payment_method: paymentMethod as 'cash' | 'card' | 'pix' | 'bank_transfer',
      payment_date: paymentDate || new Date().toISOString().split('T')[0],
    };
    
    const response = await httpClient.post<PaymentResponse>(`${this.baseUrl}/${id}/pay`, data);
    return response.data.data;
  }

  async getOverdue(): Promise<Payment[]> {
    const response = await httpClient.get<ApiResponse<Payment[]>>(`${this.baseUrl}/overdue`);
    return response.data.data;
  }

  async getByStudent(studentId: string): Promise<Payment[]> {
    const response = await httpClient.get<ApiResponse<Payment[]>>(`${this.baseUrl}/student/${studentId}`);
    return response.data.data;
  }

  async generateMonthlyPayments(month: string): Promise<Payment[]> {
    const [year, monthNum] = month.split('-');
    const data = {
      month: parseInt(monthNum, 10),
      year: parseInt(year, 10),
    };
    
    const response = await httpClient.post<ApiResponse<Payment[]>>(`${this.baseUrl}/generate-monthly`, data);
    return response.data.data;
  }
}

export const paymentService = new PaymentServiceImpl(); 