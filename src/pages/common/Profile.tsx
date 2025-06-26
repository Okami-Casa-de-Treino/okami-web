import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { User, Mail, Phone, Calendar, Award, MapPin } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'teacher':
        return 'Professor';
      case 'receptionist':
        return 'Recepcionista';
      case 'student':
        return 'Aluno';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'teacher':
        return 'bg-green-100 text-green-800';
      case 'receptionist':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-blue-100">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {(user.name || user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {user.name || user.username || 'Usuário'}
              </h2>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                {getRoleDisplayName(user.role)}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nome</p>
                    <p className="text-gray-900">{user.name || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nome de usuário</p>
                    <p className="text-gray-900">{user.username || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-gray-900">{user.email || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Data de criação</p>
                    <p className="text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                {user.reference && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Referência</p>
                      <p className="text-gray-900">{user.reference}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Role-specific information */}
            {user.role === 'teacher' && user.teacher && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Informações do Professor</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Telefone</p>
                      <p className="text-gray-900">{user.teacher.phone || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Faixa</p>
                      <p className="text-gray-900">
                        {user.teacher.belt || 'Não informado'}
                        {user.teacher.belt_degree && ` ${user.teacher.belt_degree}° Grau`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {user.role === 'student' && user.student && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Informações do Aluno</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Telefone</p>
                      <p className="text-gray-900">{user.student.phone || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Faixa</p>
                      <p className="text-gray-900">
                        {user.student.belt || 'Não informado'}
                        {user.student.belt_degree && ` ${user.student.belt_degree}° Grau`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 