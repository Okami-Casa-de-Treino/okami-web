import React, { useState } from 'react';
import { VideoContentHeader } from './components/VideoContentHeader';
import { VideoContentFilters } from './components/VideoContentFilters';
import { VideoContentStats } from './components/VideoContentStats';
import { VideoContentTable } from './components/VideoContentTable';
import { VideoUploadModal } from './components/VideoUploadModal';
import { VideoEditModal } from './components/VideoEditModal';
import { VideoViewDrawer } from './components/VideoViewDrawer';
import { ModuleHeader } from './components/ModuleHeader';
import { ModuleTable } from './components/ModuleTable';
import { ModuleStats } from './components/ModuleStats';
import { CreateModuleModal } from './components/CreateModuleModal';
import { EditModuleModal } from './components/EditModuleModal';
import { DeleteModuleModal } from './components/DeleteModuleModal';
import { ModuleDetailsDrawer } from './components/ModuleDetailsDrawer';
import { useVideoContent } from './hooks/useVideoContent';
import { useModuleManagement } from './hooks/useModuleManagement';
import { ErrorDisplay } from '../Students/components/ErrorDisplay';

type TabType = 'videos' | 'modules';

export const VideoContentScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('videos');

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
    isViewDrawerOpen,
    handleModuleFilterChange,
    handleSearch,
    handlePageChange,
    handleVideoEdit,
    handleVideoDelete,
    openEditModal,
    openViewDrawer,
    setIsUploadModalOpen,
    setIsEditModalOpen,
    setIsViewDrawerOpen,
    clearError,
  } = useVideoContent();

  const {
    modules: moduleManagementModules,
    loading: moduleLoading,
    error: moduleError,
    showCreateModal,
    showEditModal,
    showDeleteModal,
    showViewDrawer,
    selectedModule: selectedModuleForEdit,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleViewClick,
    handleCloseModals,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    clearError: clearModuleError,
  } = useModuleManagement();

  if (error || moduleError) {
    return (
      <ErrorDisplay 
        error={error || moduleError} 
        onClearError={clearError || clearModuleError}
      />
    );
  }

  const tabs = [
    { id: 'videos', label: 'Videos', count: videos.length },
    { id: 'modules', label: 'Módulos', count: moduleManagementModules.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Videos Tab Content */}
        {activeTab === 'videos' && (
          <>
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
                onView={openViewDrawer}
                onDelete={handleVideoDelete}
              />
            </div>

            {/* Video Modals */}
            <VideoUploadModal 
              isOpen={isUploadModalOpen}
              onClose={() => setIsUploadModalOpen(false)}
              modules={modules}
            />

            <VideoEditModal 
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={handleVideoEdit}
              video={selectedVideo}
              modules={modules}
            />

            <VideoViewDrawer 
              isOpen={isViewDrawerOpen}
              onClose={() => setIsViewDrawerOpen(false)}
              video={selectedVideo}
            />
          </>
        )}

        {/* Modules Tab Content */}
        {activeTab === 'modules' && (
          <>
            <ModuleHeader 
              onCreateClick={handleCreateClick}
              totalModules={moduleManagementModules.length}
            />
            
            <div className="mt-8">
              <ModuleStats modules={moduleManagementModules} />
            </div>
            
            <div className="mt-6">
              <ModuleTable
                modules={moduleManagementModules}
                loading={moduleLoading}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onView={handleViewClick}
              />
            </div>

            {/* Module Modals */}
            {showCreateModal && (
              <CreateModuleModal
                isOpen={showCreateModal}
                onClose={handleCloseModals}
                onSuccess={handleCreateSuccess}
              />
            )}

            {showEditModal && selectedModuleForEdit && (
              <EditModuleModal
                isOpen={showEditModal}
                module={selectedModuleForEdit}
                onClose={handleCloseModals}
                onSuccess={handleEditSuccess}
              />
            )}

            {showDeleteModal && selectedModuleForEdit && (
              <DeleteModuleModal
                isOpen={showDeleteModal}
                module={selectedModuleForEdit}
                onClose={handleCloseModals}
                onSuccess={handleDeleteSuccess}
              />
            )}

            <ModuleDetailsDrawer
              isOpen={showViewDrawer}
              module={selectedModuleForEdit}
              onClose={handleCloseModals}
            />
          </>
        )}
      </div>
    </div>
  );
}; 