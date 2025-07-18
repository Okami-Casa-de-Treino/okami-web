import { httpClient } from './httpClient';
import { 
  Video, 
  VideoUploadData, 
  VideoUpdateData, 
  PaginatedResponse,
  FilterParams
} from '../types';
import { IVideoService } from '../types/interfaces';

// Helper to get video duration from a File
async function getVideoDuration(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration ? Math.round(video.duration) : undefined);
    };
    video.onerror = () => {
      resolve(undefined);
    };
    video.src = url;
  });
}

class VideoService implements IVideoService {
  async getAll(params?: FilterParams): Promise<PaginatedResponse<Video>> {
    const response = await httpClient.get<{ success: boolean; data: Video[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>('/videos', { params });
    
    // Transform the response to match expected structure
    return {
      data: response.data.data || [],
      total: response.data.pagination?.total || 0,
      page: response.data.pagination?.page || 1,
      limit: response.data.pagination?.limit || 10,
      totalPages: response.data.pagination?.totalPages || 0,
    };
  }

  async getById(id: string): Promise<Video> {
    const response = await httpClient.get<Video>(`/videos/${id}`);
    return response.data;
  }

  async create(videoData: VideoUploadData): Promise<Video> {
    console.log('videoData in create:', videoData);
    // First upload the file
    const fileUploadResponse = await this.uploadFile(videoData.file);
    console.log('fileUploadResponse:', fileUploadResponse);

    // Get file size, mime type, and duration
    const fileSize = videoData.file.size;
    const mimeType = videoData.file.type;
    const duration = await getVideoDuration(videoData.file);

    // Then create the video record
    const videoRecord = {
      title: videoData.title,
      description: videoData.description,
      file_url: fileUploadResponse.data.file_url,
      thumbnail_url: fileUploadResponse.data.thumbnail_url,
      module_id: videoData.module_id,
      ...(videoData.assigned_class_id && videoData.assigned_class_id.trim() !== '' ? { assigned_class_id: videoData.assigned_class_id } : {}),
      duration,
      fileSize,
      mimeType,
    };
    console.log('videoRecord to POST:', videoRecord);

    const response = await httpClient.post<Video>('/videos', videoRecord);
    return response.data;
  }

  async update(id: string, videoData: VideoUpdateData): Promise<Video> {
    const response = await httpClient.put<Video>(`/videos/${id}`, videoData);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/videos/${id}`);
  }

  async getByModule(moduleId: string): Promise<Video[]> {
    const response = await httpClient.get<{ data?: Video[]; videos?: Video[] }>(`/videos/module/${moduleId}`);
    // Handle different possible response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data?.videos && Array.isArray(response.data.videos)) {
      return response.data.videos;
    }
    // Return empty array if no valid data found
    return [];
  }

  async getByClass(classId: string): Promise<Video[]> {
    const response = await httpClient.get<Video[]>(`/videos/class/${classId}`);
    return response.data;
  }

  async getFreeVideos(): Promise<Video[]> {
    const response = await httpClient.get<Video[]>('/videos/free');
    return response.data;
  }

  async uploadFile(file: File): Promise<{ success: boolean; data: { file_url: string; thumbnail_url?: string; file_size?: number; mime_type?: string } }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<{ success: boolean; data: { file_url: string; thumbnail_url?: string; file_size?: number; mime_type?: string } }>(
      '/videos/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}

export const videoService = new VideoService(); 