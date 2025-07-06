import React from 'react';
import { 
  User, 
  Clock, 
  Calendar, 
  Users, 
  AlertCircle,
  Save,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Shield
} from 'lucide-react';
import { useCreateClass } from './hooks/useCreateClass';

const CreateClass: React.FC = () => {
  const {
    // Form
    register,
    handleSubmit,
    errors,
    watch,
    
    // Data
    activeTeachers,
    dayOptions,
    beltRequirements,
    ageGroups,
    selectedDays,
    
    // State
    currentStep,
    totalSteps,
    isCreating,
    error,
    
    // Actions
    onSubmit,
    nextStep,
    prevStep,
    handleDayToggle,
    dismissError,
    
    // Helpers
    getStepTitle,
    getSelectedTeacher,
  } = useCreateClass();

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : isCompleted
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {isCompleted ? '✓' : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <BookOpen className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações Básicas</h2>
        <p className="text-gray-600">Defina o nome, descrição e professor da aula</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Class Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Aula *
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('name', { 
                required: 'Nome da aula é obrigatório',
                minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
              })}
              type="text"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: Jiu Jitsu Manhã, Karatê Infantil..."
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={16} />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Descreva os objetivos, metodologia ou informações importantes sobre a aula..."
          />
        </div>

        {/* Teacher Selection */}
        <div>
          <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-2">
            Professor
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              {...register('teacher_id')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
            >
              <option value="">Selecione um professor</option>
              {activeTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name}
                  {teacher.specialties && teacher.specialties.length > 0 && 
                    ` - ${teacher.specialties.join(', ')}`
                  }
                </option>
              ))}
            </select>
          </div>
          {getSelectedTeacher() && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{getSelectedTeacher()?.full_name}</strong>
                {getSelectedTeacher()?.belt && (
                  <span className="ml-2 text-blue-600">
                    Faixa {getSelectedTeacher()?.belt}
                    {getSelectedTeacher()?.belt_degree && ` ${getSelectedTeacher()?.belt_degree}º Grau`}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Calendar className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Horários e Capacidade</h2>
        <p className="text-gray-600">Configure os dias da semana, horários e número máximo de alunos</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Days of Week */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Dias da Semana *
          </label>
          <div className="grid grid-cols-7 gap-2">
            {dayOptions.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleDayToggle(day.value)}
                className={`p-3 text-center rounded-lg border-2 transition-all duration-200 ${
                  selectedDays.includes(day.value)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="text-xs font-medium">{day.short}</div>
              </button>
            ))}
          </div>
          {selectedDays.length === 0 && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={16} />
              Selecione pelo menos um dia da semana
            </p>
          )}
          {selectedDays.length > 0 && (
            <p className="mt-2 text-sm text-green-600">
              Selecionados: {selectedDays.map(day => dayOptions.find(d => d.value === day)?.label).join(', ')}
            </p>
          )}
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
              Horário de Início *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('start_time', { 
                  required: 'Horário de início é obrigatório'
                })}
                type="time"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.start_time ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.start_time && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.start_time.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
              Horário de Término *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('end_time', { 
                  required: 'Horário de término é obrigatório',
                  validate: (value) => {
                    const startTime = watch('start_time');
                    if (startTime && value && startTime >= value) {
                      return 'Horário de término deve ser após o horário de início';
                    }
                    return true;
                  }
                })}
                type="time"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.end_time ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.end_time && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.end_time.message}
              </p>
            )}
          </div>
        </div>

        {/* Duration Display */}
        {watch('start_time') && watch('end_time') && watch('start_time') < watch('end_time') && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Duração:</strong> {(() => {
                const start = new Date(`2000-01-01T${watch('start_time')}:00`);
                const end = new Date(`2000-01-01T${watch('end_time')}:00`);
                const diffMs = end.getTime() - start.getTime();
                const diffMins = Math.round(diffMs / (1000 * 60));
                const hours = Math.floor(diffMins / 60);
                const mins = diffMins % 60;
                return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
              })()}
            </p>
          </div>
        )}

        {/* Max Students */}
        <div>
          <label htmlFor="max_students" className="block text-sm font-medium text-gray-700 mb-2">
            Número Máximo de Alunos *
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('max_students', { 
                required: 'Número máximo de alunos é obrigatório',
                min: { value: 1, message: 'Deve ter pelo menos 1 aluno' },
                max: { value: 100, message: 'Máximo de 100 alunos permitido' },
                valueAsNumber: true
              })}
              type="number"
              min="1"
              max="100"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.max_students ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="20"
            />
          </div>
          {errors.max_students && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={16} />
              {errors.max_students.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Requisitos e Configurações</h2>
        <p className="text-gray-600">Configure os requisitos e status da aula</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Belt Requirement */}
        <div>
          <label htmlFor="belt_requirement" className="block text-sm font-medium text-gray-700 mb-2">
            Requisito de Faixa
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              {...register('belt_requirement')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
            >
              {beltRequirements.map((belt) => (
                <option key={belt} value={belt}>
                  {belt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Age Group */}
        <div>
          <label htmlFor="age_group" className="block text-sm font-medium text-gray-700 mb-2">
            Faixa Etária
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              {...register('age_group')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
            >
              {ageGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status da Aula
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="relative">
              <input
                {...register('status')}
                type="radio"
                value="active"
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                watch('status') === 'active'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}>
                <div className="text-center">
                  <div className="text-lg font-semibold">Ativa</div>
                  <div className="text-sm">Aula disponível para matrículas</div>
                </div>
              </div>
            </label>

            <label className="relative">
              <input
                {...register('status')}
                type="radio"
                value="inactive"
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                watch('status') === 'inactive'
                  ? 'border-gray-500 bg-gray-50 text-gray-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}>
                <div className="text-center">
                  <div className="text-lg font-semibold">Inativa</div>
                  <div className="text-sm">Aula temporariamente indisponível</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Resumo da Aula</h3>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>Nome:</strong> {watch('name') || 'Não definido'}</p>
            <p><strong>Professor:</strong> {getSelectedTeacher()?.full_name || 'Não selecionado'}</p>
            <p><strong>Dias:</strong> {selectedDays.length > 0 
              ? selectedDays.map(day => dayOptions.find(d => d.value === day)?.label).join(', ')
              : 'Nenhum dia selecionado'
            }</p>
            <p><strong>Horário:</strong> {watch('start_time') && watch('end_time') 
              ? `${watch('start_time')} às ${watch('end_time')}`
              : 'Não definido'
            }</p>
            <p><strong>Capacidade:</strong> {watch('max_students') || 0} alunos</p>
            <p><strong>Requisitos:</strong> {watch('belt_requirement')} - {watch('age_group')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Voltar para Aulas
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Nova Aula</h1>
          <p className="text-gray-600 mt-2">
            Etapa {currentStep} de {totalSteps}: {getStepTitle(currentStep)}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <div>
                  <h3 className="text-red-800 font-medium">Erro ao criar aula</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
              <button
                onClick={dismissError}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft size={20} />
              Anterior
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Próximo
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isCreating || selectedDays.length === 0}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  isCreating || selectedDays.length === 0
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Criar Aula
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass; 