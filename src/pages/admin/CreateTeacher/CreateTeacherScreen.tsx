import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  AlertCircle,
  Save,
  ArrowLeft,
  UserPlus,
  GraduationCap,
  DollarSign,
  FileText
} from 'lucide-react';
import { useCreateTeacher } from './hooks/useCreateTeacher';

const CreateTeacherScreen: React.FC = () => {
  const {
    // Form
    register,
    handleSubmit,
    errors,
    watch,
    
    // Steps
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    getStepTitle,
    
    // Data
    belts,
    availableSpecialties,
    getMaxDegree,
    
    // Handlers
    onSubmit,
    handleSpecialtyToggle,
    handlePhoneChange,
    handleCPFChange,
    goBack,
    
    // State
    isCreating,
    error,
    clearError,
  } = useCreateTeacher();

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={goBack}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <UserPlus size={28} className="mr-3 text-blue-600" />
                  Novo Professor
                </h1>
                <p className="text-gray-600 mt-1">
                  {getStepTitle(currentStep)} ({currentStep} de {totalSteps})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {renderStepIndicator()}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span className="flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </span>
              <button 
                type="button"
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep === totalSteps) {
              //@ts-expect-error - onSubmit is not typed
              handleSubmit(onSubmit)(e);
            }
          }} onKeyDown={(e) => {
            // Prevent form submission on Enter key unless we're on the last step
            if (e.key === 'Enter' && currentStep < totalSteps) {
              e.preventDefault();
              e.stopPropagation();
              nextStep();
            }
          }}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('full_name')}
                      placeholder="Digite o nome completo do professor"
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      E-mail *
                    </label>
                    <input
                      type="email"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('email')}
                      placeholder="professor@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('phone')}
                      onChange={handlePhoneChange}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register('birth_date')}
                    />
                    {errors.birth_date && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.birth_date.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText size={16} className="inline mr-2" />
                      CPF
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.cpf ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('cpf')}
                      onChange={handleCPFChange}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                    {errors.cpf && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.cpf.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Qualifications and Specialties */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Shield size={16} className="inline mr-2" />
                      Faixa Atual
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register('belt')}
                    >
                      {belts.map((belt) => (
                        <option key={belt} value={belt}>
                          {belt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grau da Faixa
                      <span className="text-xs text-gray-500 ml-2">
                        (máx: {getMaxDegree()})
                      </span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={getMaxDegree()}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.belt_degree ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('belt_degree', { valueAsNumber: true })}
                    />
                    {errors.belt_degree && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.belt_degree.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <GraduationCap size={16} className="inline mr-2" />
                    Especialidades
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableSpecialties.map((specialty) => (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => handleSpecialtyToggle(specialty)}
                        className={`p-3 text-sm border-2 rounded-lg transition-all duration-200 ${
                          (watch('specialties') || []).includes(specialty)
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                  {(watch('specialties') || []).length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Especialidades selecionadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {(watch('specialties') || []).map((specialty) => (
                          <span
                            key={specialty}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {specialty}
                            <button
                              type="button"
                              onClick={() => handleSpecialtyToggle(specialty)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign size={16} className="inline mr-2" />
                    Valor por Hora (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.hourly_rate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('hourly_rate', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.hourly_rate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.hourly_rate.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Teacher Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Inicial
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    {...register('status')}
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-4">Resumo do Professor</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>Nome:</strong> {watch('full_name') || 'Não informado'}</p>
                    <p><strong>E-mail:</strong> {watch('email') || 'Não informado'}</p>
                    <p><strong>Telefone:</strong> {watch('phone') || 'Não informado'}</p>
                    <p><strong>Faixa:</strong> {watch('belt')} {watch('belt_degree')}º Grau</p>
                    {(watch('specialties') || []).length > 0 && (
                      <p><strong>Especialidades:</strong> {(watch('specialties') || []).join(', ')}</p>
                    )}
                    {watch('hourly_rate') && (
                      <p><strong>Valor por Hora:</strong> R$ {Number(watch('hourly_rate')).toFixed(2)}</p>
                    )}
                    <p><strong>Status:</strong> {watch('status') === 'active' ? 'Ativo' : 'Inativo'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextStep();
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isCreating}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Criar Professor
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeacherScreen; 