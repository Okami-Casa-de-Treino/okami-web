import { create } from 'zustand';
import { Module } from '../types';
import { moduleService } from '../services/moduleService';
import { toastService } from '../services/toastService';

interface ModuleState {
  // State
  modules: Module[];
  currentModule: Module | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchModules: () => Promise<void>;
  fetchModuleById: (id: string) => Promise<void>;
  createModule: (module: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateModule: (id: string, module: Partial<Module>) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
  setCurrentModule: (module: Module | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  modules: [],
  currentModule: null,
  loading: false,
  error: null,
};

export const useModuleStore = create<ModuleState>((set, get) => ({
  ...initialState,

  fetchModules: async () => {
    try {
      set({ loading: true, error: null });
      const modules = await moduleService.getAll();
      set({ modules, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch modules';
      set({ error: errorMessage, loading: false });
      toastService.error(errorMessage);
    }
  },

  fetchModuleById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const module = await moduleService.getById(id);
      set({ currentModule: module, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch module';
      set({ error: errorMessage, loading: false });
      toastService.error(errorMessage);
    }
  },

  createModule: async (module: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      set({ loading: true, error: null });
      await moduleService.create(module);
      
      // Refresh the modules list
      await get().fetchModules();
      
      set({ loading: false });
      toastService.success('Module created successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create module';
      set({ error: errorMessage, loading: false });
      toastService.error(errorMessage);
    }
  },

  updateModule: async (id: string, module: Partial<Module>) => {
    try {
      set({ loading: true, error: null });
      await moduleService.update(id, module);
      
      // Refresh the modules list
      await get().fetchModules();
      
      set({ loading: false });
      toastService.success('Module updated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update module';
      set({ error: errorMessage, loading: false });
      toastService.error(errorMessage);
    }
  },

  deleteModule: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await moduleService.delete(id);
      
      // Refresh the modules list
      await get().fetchModules();
      
      set({ loading: false });
      toastService.success('Module deleted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete module';
      set({ error: errorMessage, loading: false });
      toastService.error(errorMessage);
    }
  },

  setCurrentModule: (module: Module | null) => {
    set({ currentModule: module });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
})); 