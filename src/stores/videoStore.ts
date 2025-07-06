import { create } from 'zustand';
import { Video, Module, VideoUploadData, VideoUpdateData, FilterParams, PaginatedResponse } from '../types';
import { videoService } from '../services/videoService';
import { moduleService } from '../services/moduleService';
import { toastService } from '../services/toastService';

interface VideoState {
  // State
  videos: Video[];
  modules: Module[];
  currentVideo: Video | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: FilterParams;

  // Actions
  fetchVideos: (params?: FilterParams) => Promise<void>;
  fetchModules: () => Promise<void>;
  fetchVideoById: (id: string) => Promise<void>;
  createVideo: (videoData: VideoUploadData) => Promise<void>;
  updateVideo: (id: string, videoData: VideoUpdateData) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  setCurrentVideo: (video: Video | null) => void;
  setFilters: (filters: FilterParams) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  videos: [],
  modules: [],
  currentVideo: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  filters: {},
};

export const useVideoStore = create<VideoState>((set, get) => ({
  ...initialState,

  fetchVideos: async (params?: FilterParams) => {
    try {
      set({ loading: true, error: null });
      const response: PaginatedResponse<Video> = await videoService.getAll(params);
      
      set({
        videos: response.data,
        pagination: {
          currentPage: response.page,
          totalPages: response.totalPages,
          totalItems: response.total,
          itemsPerPage: response.limit,
        },
        loading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch videos';
      set({ error: errorMessage, loading: false });
      toastService.error(errorMessage);
    }
  },

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

  fetchVideoById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const video = await videoService.getById(id);
      set({ currentVideo: video, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch video';
      set({ error: errorMessage, loading: false });
      toastService.error(errorMessage);
    }
  },

  createVideo: async (videoData: VideoUploadData) => {
    try {
      set({ loading: true, error: null });
      await videoService.create(videoData);
      
      // Refresh the videos list
      await get().fetchVideos(get().filters);
      
      set({ loading: false });
      toastService.success('Video uploaded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload video';
      set({ error: errorMessage, loading: false });
      toastService.error(errorMessage);
    }
  },

  updateVideo: async (id: string, videoData: VideoUpdateData) => {
    try {
      set({ loading: true, error: null });
      await videoService.update(id, videoData);
      
      // Refresh the videos list
      await get().fetchVideos(get().filters);
      
      set({ loading: false });
      toastService.success('Video updated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update video';
      set({ error: errorMessage, loading: false });
      toastService.error(errorMessage);
    }
  },

  deleteVideo: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await videoService.delete(id);
      
      // Refresh the videos list
      await get().fetchVideos(get().filters);
      
      set({ loading: false });
      toastService.success('Video deleted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete video';
      set({ error: errorMessage, loading: false });
      toastService.error(errorMessage);
    }
  },

  setCurrentVideo: (video: Video | null) => {
    set({ currentVideo: video });
  },

  setFilters: (filters: FilterParams) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
})); 