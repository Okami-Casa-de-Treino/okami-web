import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  GraduationCap, 
  DollarSign,
  Award,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useTeacherStore } from '../../stores';
import { AppRoutes, RouteHelpers } from '../../routes/routes.constants';

const TeacherActions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const {
    selectedTeacher,
    teacherClasses,
    isLoading,
    isDeleting,
    isLoadingClasses,
    error,
    fetchTeacherById,
    fetchTeacherClasses,
    deleteTeacher,
  } = useTeacherStore();

  useEffect(() => {
    if (id) {
      fetchTeacherById(id);
      fetchTeacherClasses(id);
    }
  }, [id, fetchTeacherById, fetchTeacherClasses]);

  const handleDelete = async () => {
    if (id) {
      await deleteTeacher(id);
      navigate(AppRoutes.TEACHERS, { 
        state: { message: 'Professor excluído com sucesso!' }
      });
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(RouteHelpers.teacherEdit(id));
    }
  };

  // Format belt display
  const formatBelt = (belt: string | null | undefined, beltDegree: number | null | undefined) => {
    if (!belt) return 'Sem faixa';
    if (beltDegree) return `${belt} ${beltDegree}º Grau`;
    return belt;
  };

  // Format specialties
  const formatSpecialties = (specialties: string[] | null | undefined) => {
    if (!specialties || specialties.length === 0) return ['Não informado'];
    return specialties;
  };

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Desconhecido';
    }
  };

  // Calculate experience years from created date
  const calculateExperience = (created_at: string) => {
    const created = new Date(created_at);
    const now = new Date();
    const years = now.getFullYear() - created.getFullYear();
    return years > 0 ? `${years} anos` : 'Menos de 1 ano';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(AppRoutes.TEACHERS)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  🥋
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedTeacher.full_name}</h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Award size={16} />
                    {formatBelt(selectedTeacher.belt, selectedTeacher.belt_degree)}
                    <span className="mx-2">•</span>
                    {calculateExperience(selectedTeacher.created_at)} de experiência
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTeacher.status)}`}>
                {selectedTeacher.status === 'active' ? (
                  <CheckCircle size={14} className="mr-1" />
                ) : (
                  <XCircle size={14} className="mr-1" />
                )}
                {formatStatus(selectedTeacher.status)}
              </span>
              <button
                onClick={handleEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={16} />
                Editar
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <User size={20} className="mr-2 text-blue-600" />
                Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <p className="text-gray-900">{selectedTeacher.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {selectedTeacher.birth_date ? new Date(selectedTeacher.birth_date).toLocaleDateString('pt-BR') : 'Não informado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <p className="text-gray-900 flex items-center">
                    <Mail size={16} className="mr-2 text-gray-400" />
                    {selectedTeacher.email || 'Não informado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <p className="text-gray-900 flex items-center">
                    <Phone size={16} className="mr-2 text-gray-400" />
                    {selectedTeacher.phone || 'Não informado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <p className="text-gray-900">{selectedTeacher.cpf || 'Não informado'}</p>
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Shield size={20} className="mr-2 text-yellow-600" />
                Qualificações
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faixa Atual</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {formatBelt(selectedTeacher.belt, selectedTeacher.belt_degree)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor por Hora</label>
                  <p className="text-gray-900 flex items-center">
                    <DollarSign size={16} className="mr-1 text-green-600" />
                    {selectedTeacher.hourly_rate ? `R$ ${Number(selectedTeacher.hourly_rate).toFixed(2)}` : 'Não informado'}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Especialidades</label>
                <div className="flex flex-wrap gap-2">
                  {formatSpecialties(selectedTeacher.specialties).map((specialty, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <GraduationCap size={14} className="mr-1" />
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Classes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Users size={20} className="mr-2 text-purple-600" />
                Aulas Ministradas
              </h2>
              {isLoadingClasses ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Carregando aulas...</p>
                  </div>
                </div>
              ) : Array.isArray(teacherClasses) && teacherClasses.length > 0 ? (
                <div className="space-y-4">
                  {teacherClasses.map((classItem) => (
                    <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{classItem.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {classItem.start_time} - {classItem.end_time}
                            </span>
                            <span className="flex items-center">
                              <Users size={14} className="mr-1" />
                              Máx: {classItem.max_students} alunos
                            </span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          classItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {classItem.status === 'active' ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Nenhuma aula encontrada</p>
                  <p className="text-sm text-gray-500">Este professor ainda não possui aulas cadastradas</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total de Aulas</span>
                  <span className="font-semibold text-gray-900">{Array.isArray(teacherClasses) ? teacherClasses.length : 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Aulas Ativas</span>
                  <span className="font-semibold text-green-600">
                    {Array.isArray(teacherClasses) ? teacherClasses.filter(c => c.status === 'active').length : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Especialidades</span>
                  <span className="font-semibold text-blue-600">
                    {formatSpecialties(selectedTeacher.specialties).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Professor cadastrado</p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedTeacher.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Última atualização</p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedTeacher.updated_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertCircle size={24} className="text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir o professor <strong>{selectedTeacher.full_name}</strong>? 
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" />
                      Excluir
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherActions; 