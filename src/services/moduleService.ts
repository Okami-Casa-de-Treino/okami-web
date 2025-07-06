import { httpClient } from './httpClient';
import { Module } from '../types';
import { IModuleService } from '../types/interfaces';

class ModuleService implements IModuleService {
  async getAll(): Promise<Module[]> {
    const response = await httpClient.get<{ success: boolean; data: Module[] }>('/modules');
    return response.data.data || [];
  }

  async getById(id: string): Promise<Module> {
    const response = await httpClient.get<Module>(`/modules/${id}`);
    return response.data;
  }

  async create(module: Omit<Module, 'id' | 'created_at' | 'updated_at'>): Promise<Module> {
    const response = await httpClient.post<Module>('/modules', module);
    return response.data;
  }

  async update(id: string, module: Partial<Module>): Promise<Module> {
    const response = await httpClient.put<Module>(`/modules/${id}`, module);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/modules/${id}`);
  }
}

export const moduleService = new ModuleService(); 