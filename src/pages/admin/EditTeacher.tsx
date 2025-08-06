import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  AlertCircle,
  Save,
  ArrowLeft,
  Edit,
  GraduationCap,
  DollarSign,
  FileText
} from 'lucide-react';
import { useTeacherStore } from '../../stores';
import { Teacher } from '../../types';
import { AppRoutes } from '../../routes/routes.constants';

interface EditTeacherForm {
  full_name: string;
  email: string;
  phone: string;
  birth_date?: string;
  cpf?: string;
  belt?: string;
  belt_degree?: number;
  specialties?: string[];
  hourly_rate?: number;
  status: 'active' | 'inactive';
}

const EditTeacher: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  
  const {
    selectedTeacher,
    isLoading,
    isUpdating,
    error,
    fetchTeacherById,
    updateTeacher,
    clearError,
  } = useTeacherStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<EditTeacherForm>();

  // Martial arts belts
  const belts = [
    'Branca',
    'Azul',
    'Roxa',
    'Marrom',
    'Preta',
    'Coral',
    'Vermelha'
  ];

  // Common martial arts specialties
  const availableSpecialties = [
    'Jiu Jitsu',
    'Karatê',
    'Judô',
    'Taekwondo',
    'Muay Thai',
    'Boxe',
    'MMA',
    'Defesa Pessoal',
    'Kung Fu',
    'Capoeira',
    'Krav Maga',
  ];

  useEffect(() => {
    if (id) {
      fetchTeacherById(id);
    }
  }, [id, fetchTeacherById]);

  useEffect(() => {
    if (selectedTeacher) {
      reset({
        full_name: selectedTeacher.full_name,
        email: selectedTeacher.email || '',
        phone: selectedTeacher.phone || '',
        birth_date: selectedTeacher.birth_date || '',
        cpf: selectedTeacher.cpf || '',
        belt: selectedTeacher.belt || 'Branca',
        belt_degree: selectedTeacher.belt_degree || 1,
        hourly_rate: selectedTeacher.hourly_rate || 0,
        status: selectedTeacher.status,
      });
      setSelectedSpecialties(selectedTeacher.specialties || []);
    }
  }, [selectedTeacher, reset]);

  const getMaxDegree = () => {
    const currentBelt = watch('belt');
    
    switch (currentBelt) {
      case 'Branca':
        return 4;
      case 'Azul':
      case 'Roxa':
      case 'Marrom':
        return 4;
      case 'Preta':
        return 10;
      default:
        return 1;
    }
  };

  const onSubmit = async (data: EditTeacherForm) => {
    if (!id) return;
    
    try {
      const updateData: Partial<Teacher> = {
        ...data,
        specialties: selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
        hourly_rate: data.hourly_rate ? Number(data.hourly_rate) : undefined,
      };

      await updateTeacher(id, updateData);
      navigate(AppRoutes.TEACHERS, { 
        state: { message: 'Professor atualizado com sucesso!' }
      });
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty);
      } else {
        return [...prev, specialty];
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Carregando dados do professor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedTeacher) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle size={20} className="text-red-600 mr-3" />
                <p className="text-red-800">{error || 'Professor não encontrado'}</p>
              </div>
              <button
                onClick={() => navigate(AppRoutes.TEACHERS)}
                className="text-red-600 hover:text-red-800"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Edit size={28} className="mr-3 text-blue-600" />
                  Editar Professor
                </h1>
                <p className="text-gray-600 mt-1">
                  Atualize as informações de {selectedTeacher.full_name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span className="flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </span>
              <button 
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <User size={20} className="mr-2 text-blue-600" />
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    {...register('full_name', { required: 'Nome é obrigatório' })}
                    placeholder="Nome completo do professor"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    {...register('email', { 
                      required: 'E-mail é obrigatório',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'E-mail inválido'
                      }
                    })}
                    placeholder="email@exemplo.com"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    {...register('phone', { required: 'Telefone é obrigatório' })}
                    placeholder="(11) 99999-9999"
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="inline mr-2" />
                    CPF
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    {...register('cpf')}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    {...register('status')}
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Shield size={20} className="mr-2 text-yellow-600" />
                Qualificações e Especialidades
              </h3>
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
                    min="0"
                    max={getMaxDegree()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    {...register('belt_degree', { 
                      valueAsNumber: true,
                      min: { value: 1, message: 'Grau mínimo é 1' },
                      max: { value: getMaxDegree(), message: `Grau máximo é ${getMaxDegree()}` }
                    })}
                  />
                  {errors.belt_degree && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.belt_degree.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
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
                        selectedSpecialties.includes(specialty)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Clique nas especialidades para selecioná-las
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-2" />
                  Valor por Hora (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  {...register('hourly_rate', { 
                    valueAsNumber: true,
                    min: { value: 0, message: 'Valor deve ser positivo' }
                  })}
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

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(AppRoutes.TEACHERS)}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isUpdating}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTeacher; 