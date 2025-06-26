import React from 'react';
import { ArrowLeft, Save, X, User, Calendar, Clock, Settings, AlertCircle } from 'lucide-react';
import { useEditClass } from './hooks/useEditClass';

const EditClass: React.FC = () => {
  const {
    // Form
    register,
    handleSubmit,
    errors,
    watch,
    
    // Data
    selectedClass,
    activeTeachers,
    dayOptions,
    beltRequirements,
    ageGroups,
    selectedDays,
    
    // State
    currentStep,
    totalSteps,
    isLoading,
    isUpdating,
    error,
    isDataLoaded,
    
    // Actions
    onSubmit,
    nextStep,
    prevStep,
    handleDayToggle,
    dismissError,
    handleCancel,
    
    // Helpers
    getStepTitle,
    getSelectedTeacher,
  } = useEditClass();

  if (isLoading || !isDataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Aula não encontrada</h1>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} />
              Voltar para Aulas
            </button>
          </div>
        </div>
      </div>
    );
  }

  const startTime = watch('start_time');
  const endTime = watch('end_time');
  
  const getDuration = () => {
    if (!startTime || !endTime) return '';
    try {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.round(diffMs / (1000 * 60));
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    } catch {
      return '';
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <User size={20} />;
      case 2: return <Calendar size={20} />;
      case 3: return <Settings size={20} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Voltar para Aulas
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Aula</h1>
              <p className="text-gray-600 mt-1">Modifique as informações da aula "{selectedClass.name}"</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <div>
                  <h3 className="text-red-800 font-medium">Erro ao salvar</h3>
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

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  step === currentStep
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : step < currentStep
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}>
                  {step < currentStep ? '✓' : getStepIcon(step)}
                </div>
                {step < totalSteps && (
                  <div className={`h-1 w-24 ml-4 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900">{getStepTitle(currentStep)}</h2>
            <p className="text-gray-600">Passo {currentStep} de {totalSteps}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Aula *
                  </label>
                  <input
                    {...register('name', { required: 'Nome da aula é obrigatório' })}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Jiu Jitsu - Iniciantes"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Descreva o conteúdo e objetivos da aula..."
                  />
                </div>

                <div>
                  <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Professor
                  </label>
                  <select
                    {...register('teacher_id')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Selecione um professor</option>
                    {activeTeachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.full_name}
                        {teacher.belt && ` - Faixa ${teacher.belt}`}
                        {teacher.belt_degree && ` ${teacher.belt_degree}º Dan`}
                      </option>
                    ))}
                  </select>
                  
                  {getSelectedTeacher() && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          {getSelectedTeacher()?.full_name}
                        </span>
                      </div>
                      {getSelectedTeacher()?.specialties && (
                        <p className="text-sm text-blue-700 mt-1">
                          Especialidades: {getSelectedTeacher()?.specialties}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Schedule and Capacity */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dias da Semana *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {dayOptions.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => handleDayToggle(day.value)}
                        className={`p-3 text-center rounded-lg border-2 transition-all ${
                          selectedDays.includes(day.value)
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-medium text-sm">{day.short}</div>
                      </button>
                    ))}
                  </div>
                  {selectedDays.length === 0 && (
                    <p className="mt-1 text-sm text-red-600">Selecione pelo menos um dia da semana</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                      Horário de Início *
                    </label>
                    <input
                      {...register('start_time', { required: 'Horário de início é obrigatório' })}
                      type="time"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.start_time ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.start_time && (
                      <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                      Horário de Término *
                    </label>
                    <input
                      {...register('end_time', { required: 'Horário de término é obrigatório' })}
                      type="time"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.end_time ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.end_time && (
                      <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
                    )}
                  </div>
                </div>

                {startTime && endTime && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Duração: {getDuration()}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="max_students" className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Alunos *
                  </label>
                  <input
                    {...register('max_students', { 
                      required: 'Número máximo de alunos é obrigatório',
                      min: { value: 1, message: 'Deve ter pelo menos 1 aluno' },
                      max: { value: 100, message: 'Máximo de 100 alunos' },
                      valueAsNumber: true
                    })}
                    type="number"
                    min="1"
                    max="100"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.max_students ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="20"
                  />
                  {errors.max_students && (
                    <p className="mt-1 text-sm text-red-600">{errors.max_students.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Requirements and Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="belt_requirement" className="block text-sm font-medium text-gray-700 mb-2">
                    Requisito de Faixa
                  </label>
                  <select
                    {...register('belt_requirement')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {beltRequirements.map((belt) => (
                      <option key={belt} value={belt}>{belt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="age_group" className="block text-sm font-medium text-gray-700 mb-2">
                    Faixa Etária
                  </label>
                  <select
                    {...register('age_group')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {ageGroups.map((age) => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status da Aula
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Aulas inativas não aparecerão para matrícula de novos alunos
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClass; 