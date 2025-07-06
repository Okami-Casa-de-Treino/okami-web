import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVideoStore } from '../../../../stores/videoStore';
import { useClassStore } from '../../../../stores/classStore';
import { VideoUploadFormData, VideoUpdateFormData, videoUploadSchema, videoUpdateSchema } from '../schemas';
import { Video, Module } from '../../../../types';

export const useVideoContent = () => {
  const {
    videos,
    modules,
    currentVideo,
    loading,
    error,
    pagination,
    filters,
    fetchVideos,
    fetchModules,
    createVideo,
    updateVideo,
    deleteVideo,
    setFilters,
    clearError,
  } = useVideoStore();

  const { classes, fetchClasses } = useClassStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>('all');

  // Upload form
  const uploadForm = useForm<VideoUploadFormData>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      module_id: '',
      assigned_class_id: '',
    },
  });

  // Edit form
  const editForm = useForm<VideoUpdateFormData>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: {
      title: '',
      description: '',
      module_id: '',
      assigned_class_id: '',
    },
  });

  // Load initial data
  useEffect(() => {
    fetchVideos();
    fetchModules();
    fetchClasses();
  }, [fetchVideos, fetchModules, fetchClasses]);

  // Handle module filter change
  const handleModuleFilterChange = (moduleId: string) => {
    setSelectedModule(moduleId);
    const newFilters = { ...filters };
    
    if (moduleId === 'all') {
      delete newFilters.moduleId;
    } else {
      newFilters.moduleId = moduleId;
    }
    
    setFilters(newFilters);
    fetchVideos(newFilters);
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm || undefined };
    setFilters(newFilters);
    fetchVideos(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchVideos(newFilters);
  };

  // Handle video upload
  const handleVideoUpload = async (data: VideoUploadFormData) => {
    await createVideo(data);
    uploadForm.reset();
  };

  // Handle video edit
  const handleVideoEdit = async (data: VideoUpdateFormData) => {
    if (selectedVideo) {
      await updateVideo(selectedVideo.id, data);
      setIsEditModalOpen(false);
      setSelectedVideo(null);
      editForm.reset();
    }
  };

  // Handle video delete
  const handleVideoDelete = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await deleteVideo(videoId);
    }
  };

  // Open edit modal
  const openEditModal = (video: Video) => {
    setSelectedVideo(video);
    editForm.reset({
      title: video.title,
      description: video.description,
      module_id: video.module_id,
      assigned_class_id: video.assigned_class_id,
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (video: Video) => {
    setSelectedVideo(video);
    setIsViewModalOpen(true);
  };

  // Get module by ID
  const getModuleById = (moduleId: string): Module | undefined => {
    return modules.find(module => module.id === moduleId);
  };

  // Get class by ID
  const getClassById = (classId: string) => {
    return classes.find(cls => cls.id === classId);
  };

  // Format duration
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get filtered videos
  const getFilteredVideos = () => {
    if (selectedModule === 'all') {
      return videos;
    }
    return videos.filter(video => video.module_id === selectedModule);
  };

  return {
    // State
    videos: getFilteredVideos(),
    modules,
    classes,
    currentVideo,
    loading,
    error,
    pagination,
    selectedModule,
    selectedVideo,
    isUploadModalOpen,
    isEditModalOpen,
    isViewModalOpen,

    // Forms
    uploadForm,
    editForm,

    // Actions
    handleModuleFilterChange,
    handleSearch,
    handlePageChange,
    handleVideoUpload,
    handleVideoEdit,
    handleVideoDelete,
    openEditModal,
    openViewModal,
    setIsUploadModalOpen,
    setIsEditModalOpen,
    setIsViewModalOpen,
    clearError,

    // Utilities
    getModuleById,
    getClassById,
    formatDuration,
  };
}; 