import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useClassDetails } from './hooks/useClassDetails';
import StudentAssignmentModal from './ClassDetails/StudentAssignmentModal';
import ClassDetailsHeader from './ClassDetails/ClassDetailsHeader';
import ClassDetailsTabNavigation from './ClassDetails/ClassDetailsTabNavigation';
import ClassBasicInfo from './ClassDetails/ClassBasicInfo';
import ClassScheduleInfo from './ClassDetails/ClassScheduleInfo';
import ClassRequirements from './ClassDetails/ClassRequirements';
import ClassMetadata from './ClassDetails/ClassMetadata';
import ClassStudentsList from './ClassDetails/ClassStudentsList';
import ClassCheckinsList from './ClassDetails/ClassCheckinsList';
import ClassDeleteModal from './ClassDetails/ClassDeleteModal';

const ClassDetails: React.FC = () => {
  const [showStudentAssignmentModal, setShowStudentAssignmentModal] = useState(false);

  const {
    // Data
    classData,
    students,
    checkins,
    
    // State
    activeTab,
    showDeleteModal,
    isLoading,
    isDeleting,
    error,
    
    // Actions
    setActiveTab,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    dismissError,
    refreshClassData,
    
    // Helpers
    formatDaysOfWeek,
    formatTime,
    getDuration,
    getStatusColor,
    getStudentsFillPercentage,
  } = useClassDetails();

  const handleOpenStudentAssignment = () => {
    setShowStudentAssignmentModal(true);
  };

  const handleCloseStudentAssignment = () => {
    setShowStudentAssignmentModal(false);
  };

  const handleStudentAssigned = () => {
    // Refresh the class data to update the student list
    refreshClassData();
  };

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Aula não encontrada</h1>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ClassDetailsHeader
          classData={classData}
          isDeleting={isDeleting}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          onBack={handleBack}
          formatDaysOfWeek={formatDaysOfWeek}
          formatTime={formatTime}
        />

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <div>
                  <h3 className="text-red-800 font-medium">Erro</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
              <button
                onClick={dismissError}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <ClassDetailsTabNavigation
          activeTab={activeTab}
          students={students}
          checkins={checkins}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClassBasicInfo 
                classData={classData}
                getStatusColor={getStatusColor}
              />
              <ClassScheduleInfo
                classData={classData}
                students={students}
                formatDaysOfWeek={formatDaysOfWeek}
                formatTime={formatTime}
                getDuration={getDuration}
                getStudentsFillPercentage={getStudentsFillPercentage}
              />
              <ClassRequirements classData={classData} />
              <ClassMetadata classData={classData} />
            </div>
          )}

          {activeTab === 'students' && (
            <ClassStudentsList
              students={students}
              onManageStudents={handleOpenStudentAssignment}
            />
          )}

          {activeTab === 'checkins' && (
            <ClassCheckinsList checkins={checkins} />
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <ClassDeleteModal
          isOpen={showDeleteModal}
          classData={classData}
          students={students}
          isDeleting={isDeleting}
          onConfirm={handleDelete}
          onCancel={cancelDelete}
        />

        {/* Student Assignment Modal */}
        <StudentAssignmentModal
          isOpen={showStudentAssignmentModal}
          onClose={handleCloseStudentAssignment}
          classId={classData.id}
          className={classData.name}
          assignedStudents={students}
          onStudentAssigned={handleStudentAssigned}
        />
      </div>
    </div>
  );
};

export default ClassDetails; 