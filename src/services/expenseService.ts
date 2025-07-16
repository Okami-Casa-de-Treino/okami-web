import { Expense, PaginatedResponse, FilterParams } from '../types';
import { httpClient } from './httpClient';
import { IExpenseService } from '../types/interfaces';

export interface ExpenseResponse {
  data: Expense;
  success: boolean;
}

export interface ExpenseCreateData {
  title: string;
  description?: string;
  amount: number | string;
  category: 'rent' | 'utilities' | 'equipment' | 'maintenance' | 'marketing' | 'insurance' | 'taxes' | 'salary' | 'other';
  expense_date: string;
  due_date: string;
  payment_method?: 'cash' | 'card' | 'bank_transfer';
  status?: 'pending' | 'paid' | 'cancelled';
  receipt_url?: string;
  notes?: string;
}

class ExpenseServiceImpl implements IExpenseService {
  private readonly baseUrl = '/expenses';

  async getAll(params?: FilterParams): Promise<PaginatedResponse<Expense>> {
    const response = await httpClient.get<PaginatedResponse<Expense>>(this.baseUrl, { params });
    return response.data;
  }

  async getById(id: string): Promise<Expense> {
    const response = await httpClient.get<ExpenseResponse>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async create(expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
    // Transform camelCase to snake_case for API
    const apiData = {
      title: expenseData.title,
      description: expenseData.description,
      amount: expenseData.amount,
      category: expenseData.category,
      expense_date: expenseData.expense_date,
      due_date: expenseData.due_date,
      payment_method: expenseData.payment_method,
      status: expenseData.status || 'pending',
      receipt_url: expenseData.receipt_url,
      notes: expenseData.notes
    };

    const response = await httpClient.post<ExpenseResponse>(this.baseUrl, apiData);
    return response.data.data;
  }

  async update(id: string, expenseData: Partial<Expense>): Promise<Expense> {
    // Transform camelCase to snake_case for API
    const apiData: Record<string, unknown> = {};
    
    if (expenseData.title !== undefined) apiData.title = expenseData.title;
    if (expenseData.description !== undefined) apiData.description = expenseData.description;
    if (expenseData.amount !== undefined) apiData.amount = expenseData.amount;
    if (expenseData.category !== undefined) apiData.category = expenseData.category;
    if (expenseData.expense_date !== undefined) apiData.expense_date = expenseData.expense_date;
    if (expenseData.due_date !== undefined) apiData.due_date = expenseData.due_date;
    if (expenseData.payment_method !== undefined) apiData.payment_method = expenseData.payment_method;
    if (expenseData.status !== undefined) apiData.status = expenseData.status;
    if (expenseData.receipt_url !== undefined) apiData.receipt_url = expenseData.receipt_url;
    if (expenseData.notes !== undefined) apiData.notes = expenseData.notes;

    const response = await httpClient.put<ExpenseResponse>(`${this.baseUrl}/${id}`, apiData);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const expenseService = new ExpenseServiceImpl(); 