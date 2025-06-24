import React from 'react';
import { Plus, Search, Filter, Calendar, MoreHorizontal, Edit, Trash2, Eye, Clock, Users, Play } from 'lucide-react';

const Classes: React.FC = () => {
  // Mock data for demonstration
  const classes = [
    {
      id: '1',
      name: 'Karatê Infantil',
      teacher: 'Sensei Carlos Yamamoto',
      schedule: 'Segunda e Quarta - 09:00-10:00',
      students: 15,
      maxStudents: 20,
      status: 'Ativa',
      level: 'Iniciante',
      duration: '60 min',
      room: 'Dojo 1'
    },
    {
      id: '2',
      name: 'Judô Adulto',
      teacher: 'Sensei Ana Silva',
      schedule: 'Terça e Quinta - 14:00-15:30',
      students: 22,
      maxStudents: 25,
      status: 'Ativa',
      level: 'Intermediário',
      duration: '90 min',
      room: 'Dojo 2'
    },
    {
      id: '3',
      name: 'Aikido Avançado',
      teacher: 'Sensei Roberto Santos',
      schedule: 'Sexta - 18:00-19:30',
      students: 8,
      maxStudents: 15,
      status: 'Pausada',
      level: 'Avançado',
      duration: '90 min',
      room: 'Dojo 3'
    },
    {
      id: '4',
      name: 'Defesa Pessoal',
      teacher: 'Sensei Carlos Yamamoto',
      schedule: 'Sábado - 10:00-11:00',
      students: 12,
      maxStudents: 18,
      status: 'Ativa',
      level: 'Todos os níveis',
      duration: '60 min',
      room: 'Dojo 1'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa':
        return 'bg-green-100 text-green-800';
      case 'Pausada':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      case 'Planejada':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return 'bg-green-100 text-green-800';
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avançado':
        return 'bg-red-100 text-red-800';
      case 'Todos os níveis':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStudentsFillPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aulas</h1>
          <p className="text-gray-600 mt-1">Gerenciar aulas e horários</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={20} />
            Grade de Horários
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm">
            <Plus size={20} />
            Nova Aula
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar aulas..." 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Aulas</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aulas Ativas</p>
              <p className="text-2xl font-bold text-green-600">10</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Play size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alunos Matriculados</p>
              <p className="text-2xl font-bold text-purple-600">57</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aulas Hoje</p>
              <p className="text-2xl font-bold text-orange-600">6</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Aula</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Professor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Horário</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Alunos</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.length > 0 ? (
                classes.map((classItem) => (
                  <tr key={classItem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          🥋
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{classItem.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(classItem.level)}`}>
                              {classItem.level}
                            </span>
                            <span className="text-xs text-gray-500">{classItem.room}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{classItem.teacher}</p>
                      <p className="text-sm text-gray-500">{classItem.duration}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-900">{classItem.schedule}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {classItem.students}/{classItem.maxStudents}
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.round(getStudentsFillPercentage(classItem.students, classItem.maxStudents))}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getStudentsFillPercentage(classItem.students, classItem.maxStudents)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(classItem.status)}`}>
                        {classItem.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Calendar size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">Nenhuma aula encontrada</p>
                        <p className="text-gray-500 text-sm">Comece criando sua primeira aula</p>
                      </div>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus size={16} />
                        Criar Aula
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Classes; 