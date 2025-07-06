import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  AlertCircle,
  Save,
  ArrowLeft,
  UserPlus,
  Users
} from 'lucide-react';
import { useCreateStudent } from './hooks/useCreateStudent';
import { StepIndicator } from '../../../components/common/StepIndicator';

const CreateStudentScreen: React.FC = () => {
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
    selectedAgeGroup,
    getBeltOptions,
    getMaxDegree,
    relationshipOptions,
    
    // Handlers
    onSubmit,
    handleAgeGroupChange,
    handlePhoneChange,
    handleEmergencyPhoneChange,
    handleCPFChange,
    goBack,
    
    // State
    isCreating,
    error,
    clearError,
  } = useCreateStudent();

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
                  Novo Aluno
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
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

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
                      placeholder="Digite o nome completo"
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
                      Email *
                    </label>
                    <input
                      type="email"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('email')}
                      placeholder="Digite o email"
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
                      <Shield size={16} className="inline mr-2" />
                      Senha *
                    </label>
                    <input
                      type="password"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('password')}
                      placeholder="Digite a senha (mín. 6 caracteres)"
                      minLength={6}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.password.message}
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
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.birth_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('birth_date')}
                    />
                    {errors.birth_date && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.birth_date.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Documents and Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RG
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.rg ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('rg')}
                      placeholder="00.000.000-0"
                    />
                    {errors.rg && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.rg.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Endereço Completo
                  </label>
                  <textarea
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('address')}
                    placeholder="Rua, número, bairro, cidade, CEP..."
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Emergency Contact */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Contato de Emergência
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.emergency_contact_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('emergency_contact_name')}
                      placeholder="Nome completo"
                    />
                    {errors.emergency_contact_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.emergency_contact_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone do Contato de Emergência
                    </label>
                    <input
                      type="tel"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.emergency_contact_phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('emergency_contact_phone')}
                      onChange={handleEmergencyPhoneChange}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                    {errors.emergency_contact_phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.emergency_contact_phone.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parentesco/Relação
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register('emergency_contact_relationship')}
                    >
                      <option value="">Selecione o parentesco</option>
                      {relationshipOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações Médicas
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    {...register('medical_observations')}
                    placeholder="Alergias, medicamentos, condições médicas, restrições..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Student Settings */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Age Group Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Users size={16} className="inline mr-2" />
                    Categoria de Idade *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAgeGroupChange('Infantil');
                      }}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                        selectedAgeGroup === 'Infantil'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">👶</div>
                        <div className="font-semibold">Infantil</div>
                        <div className="text-sm text-gray-600">4-15 anos</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAgeGroupChange('Adulto');
                      }}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                        selectedAgeGroup === 'Adulto'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">🥋</div>
                        <div className="font-semibold">Adulto</div>
                        <div className="text-sm text-gray-600">16+ anos</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Shield size={16} className="inline mr-2" />
                        Faixa Atual
                        <span className="text-xs text-gray-500 ml-2">
                          ({selectedAgeGroup === 'Infantil' ? 'Sistema Infantil' : 'Sistema Adulto'})
                        </span>
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        {...register('belt')}
                      >
                        {getBeltOptions(selectedAgeGroup).map((belt) => (
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
                          (máx: {getMaxDegree(watch('belt') || 'Branca', selectedAgeGroup)})
                        </span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={getMaxDegree(watch('belt') || 'Branca', selectedAgeGroup)}
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
                      <option value="suspended">Suspenso</option>
                    </select>
                  </div>
                </div>

                {/* Belt System Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Sistema de Faixas - {selectedAgeGroup === 'Infantil' ? 'Infantil' : 'Adulto'}
                  </h4>
                  <div className="text-sm text-blue-800">
                    {selectedAgeGroup === 'Infantil' ? (
                      <div>
                        <p className="mb-2">Sistema infantil (4-15 anos):</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          {getBeltOptions('Infantil').map((belt, index) => (
                            <span key={belt} className="bg-white px-2 py-1 rounded">
                              {index + 1}. {belt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-2">Sistema adulto (16+ anos):</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {getBeltOptions('Adulto').map((belt, index) => (
                            <span key={belt} className="bg-white px-2 py-1 rounded">
                              {index + 1}. {belt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevStep();
                }}
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
                      Criar Aluno
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

export default CreateStudentScreen; 