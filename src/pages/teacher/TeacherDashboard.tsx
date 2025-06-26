import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Calendar, Users, CheckCircle, Clock, BookOpen, Award } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  // Mock data - in real app, this would come from API
  const teacherStats = {
    totalClasses: 5,
    totalStudents: 42,
    todayClasses: 2,
    attendanceRate: 85,
  };

  const todayClasses = [
    { id: 1, name: 'Jiu-Jitsu Adulto', time: '19:00', students: 15, duration: '1h30min' },
    { id: 2, name: 'Jiu-Jitsu Kids', time: '20:30', students: 8, duration: '1h' },
  ];

  const recentStudents = [
    { id: 1, name: 'João Silva', belt: 'Azul', lastClass: '2024-01-10' },
    { id: 2, name: 'Maria Santos', belt: 'Branca', lastClass: '2024-01-10' },
    { id: 3, name: 'Pedro Costa', belt: 'Roxa', lastClass: '2024-01-09' },
    { id: 4, name: 'Ana Oliveira', belt: 'Azul', lastClass: '2024-01-09' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Olá, Prof. {user?.name || user?.username || 'Professor'}!
        </h1>
        <p className="text-green-100">
          Gerencie suas turmas e acompanhe o progresso dos seus alunos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Turmas</p>
              <p className="text-2xl font-bold text-gray-900">{teacherStats.totalClasses}</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900">{teacherStats.totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aulas Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{teacherStats.todayClasses}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Presença</p>
              <p className="text-2xl font-bold text-gray-900">{teacherStats.attendanceRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Aulas de Hoje
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {classItem.students} alunos
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {classItem.duration}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">{classItem.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {todayClasses.length === 0 && (
              <p className="text-gray-500 text-center py-8">Nenhuma aula agendada para hoje</p>
            )}
          </div>
        </div>

        {/* Recent Students */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Alunos Recentes
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Faixa {student.belt}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Última aula</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(student.lastClass).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 