import { Payment, PaginatedResponse, FilterParams, ApiResponse } from '../types';
import { httpClient } from './httpClient';
import { IPaymentService } from '../types/interfaces';

export interface PaymentResponse {
  data: Payment;
  success: boolean;
}

export interface PaymentCreateData {
  student_id: string;
  amount: number;
  due_date: string;
  reference_month: string;
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
    // Transform camelCase to snake_case for API
    const apiData = {
      student_id: paymentData.student_id,
      amount: paymentData.amount,
      due_date: paymentData.due_date,
      reference_month: paymentData.reference_month,
      discount: paymentData.discount || 0,
      late_fee: paymentData.late_fee || 0,
      status: paymentData.status || 'pending',
      notes: paymentData.notes,
      payment_date: paymentData.payment_date,
      payment_method: paymentData.payment_method
    };

    const response = await httpClient.post<PaymentResponse>(this.baseUrl, apiData);
    return response.data.data;
  }

  async update(id: string, paymentData: Partial<Payment>): Promise<Payment> {
    // Transform camelCase to snake_case for API
    const apiData: Record<string, unknown> = {};
    
    if (paymentData.student_id !== undefined) apiData.student_id = paymentData.student_id;
    if (paymentData.amount !== undefined) apiData.amount = paymentData.amount;
    if (paymentData.due_date !== undefined) apiData.due_date = paymentData.due_date;
    if (paymentData.reference_month !== undefined) apiData.reference_month = paymentData.reference_month;
    if (paymentData.discount !== undefined) apiData.discount = paymentData.discount;
    if (paymentData.late_fee !== undefined) apiData.late_fee = paymentData.late_fee;
    if (paymentData.status !== undefined) apiData.status = paymentData.status;
    if (paymentData.notes !== undefined) apiData.notes = paymentData.notes;
    if (paymentData.payment_date !== undefined) apiData.payment_date = paymentData.payment_date;
    if (paymentData.payment_method !== undefined) apiData.payment_method = paymentData.payment_method;

    const response = await httpClient.put<PaymentResponse>(`${this.baseUrl}/${id}`, apiData);
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

  async generateMonthlyPayments(reference_month: string, due_day: number): Promise<Payment[]> {
    const data = {
      reference_month,
      due_day,
    };
    
    const response = await httpClient.post<ApiResponse<Payment[]>>(`${this.baseUrl}/generate-monthly`, data);
    return response.data.data;
  }
}

export const paymentService = new PaymentServiceImpl(); 