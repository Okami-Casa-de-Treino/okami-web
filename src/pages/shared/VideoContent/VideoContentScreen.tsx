import React from 'react';
import { VideoContentHeader } from './components/VideoContentHeader';
import { VideoContentFilters } from './components/VideoContentFilters';
import { VideoContentStats } from './components/VideoContentStats';
import { VideoContentTable } from './components/VideoContentTable';
import { VideoUploadModal } from './components/VideoUploadModal';
import { VideoEditModal } from './components/VideoEditModal';
import { VideoViewModal } from './components/VideoViewModal';
import { useVideoContent } from './hooks/useVideoContent';
import { ErrorDisplay } from '../Students/components/ErrorDisplay';

export const VideoContentScreen: React.FC = () => {
  const {
    videos,
    modules,
    loading,
    error,
    pagination,
    selectedModule,
    selectedVideo,
    isUploadModalOpen,
    isEditModalOpen,
    isViewModalOpen,
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
  } = useVideoContent();

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        onClearError={clearError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VideoContentHeader 
          onUploadClick={() => setIsUploadModalOpen(true)}
          totalVideos={videos.length}
        />
        
        <div className="mt-8">
          <VideoContentStats 
            totalVideos={videos.length}
            selectedModule={selectedModule}
            modules={modules}
          />
        </div>

        <div className="mt-6">
          <VideoContentFilters 
            modules={modules}
            selectedModule={selectedModule}
            onModuleChange={handleModuleFilterChange}
            onSearch={handleSearch}
          />
        </div>

        <div className="mt-6">
          <VideoContentTable 
            videos={videos}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onEdit={openEditModal}
            onView={openViewModal}
            onDelete={handleVideoDelete}
          />
        </div>

        {/* Modals */}
        <VideoUploadModal 
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSubmit={handleVideoUpload}
          modules={modules}
        />

        <VideoEditModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleVideoEdit}
          video={selectedVideo}
          modules={modules}
        />

        <VideoViewModal 
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          video={selectedVideo}
        />
      </div>
    </div>
  );
}; 