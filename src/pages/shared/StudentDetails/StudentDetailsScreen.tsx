import React from 'react';
import { StudentDetailsHeader } from './components/StudentDetailsHeader';
import { StudentBasicInfo } from './components/StudentBasicInfo';
import { StudentContactInfo } from './components/StudentContactInfo';
import { StudentMartialArtsInfo } from './components/StudentMartialArtsInfo';
import { StudentBeltProgressionInfo } from './components/StudentBeltProgressionInfo';
import { StudentClassesList } from './components/StudentClassesList';
import { StudentCheckinsList } from './components/StudentCheckinsList';
import { StudentPaymentsList } from './components/StudentPaymentsList';
import { StudentDetailsTabNavigation } from './components/StudentDetailsTabNavigation';
import { ErrorDisplay } from './components/ErrorDisplay';
import { useStudentDetails } from './hooks/useStudentDetails';

const StudentDetailsScreen: React.FC = () => {  
  const {
    // Data
    student,
    classes,
    checkins,
    payments,
    
    // State
    activeTab,
    isLoading,
    error,
    
    // Actions
    setActiveTab,
    handleEdit,
    handleDelete,
    clearError,
    refreshStudentData,
    refreshPaymentsData,
    
    // Helpers
    getStatusColor,
    getBeltDisplay,
  } = useStudentDetails();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-500">Carregando dados do aluno...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Aluno não encontrado</h1>
            <button
              onClick={() => window.history.back()}
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
        <StudentDetailsHeader
          student={student}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getStatusColor={getStatusColor}
        />

        {/* Error Display */}
        <ErrorDisplay error={error} onClearError={clearError} />

        {/* Tab Navigation */}
        <StudentDetailsTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          classes={classes}
          checkins={checkins}
          payments={payments}
        />

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StudentBasicInfo
                student={student}
                getStatusColor={getStatusColor}
              />
              <StudentContactInfo
                student={student}
              />
              <StudentMartialArtsInfo
                student={student}
                getBeltDisplay={getBeltDisplay}
              />
            </div>
          )}

          {activeTab === 'belt-progression' && (
            <StudentBeltProgressionInfo
              student={student}
            />
          )}

          {activeTab === 'classes' && (
            <StudentClassesList
              // @ts-expect-error - classes is of type StudentClassResponse[]
              classes={classes}
              onRefresh={refreshStudentData}
            />
          )}

          {activeTab === 'checkins' && (
            <StudentCheckinsList
              checkins={checkins}
            />
          )}

          {activeTab === 'payments' && (
            <StudentPaymentsList
              payments={payments}
              student={student}
              onRefresh={refreshPaymentsData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsScreen; 