import React, { useState } from 'react';
import { QrCode, UserCheck, Clock, Users, Calendar, CheckCircle, Play, Pause } from 'lucide-react';
import { useCheckin } from './hooks/useCheckin';
import { TeacherCheckinModal, StudentCheckinModal } from '../../components/common/CheckinModals';
import { useAuthStore } from '../../stores';

const Checkin: React.FC = () => {
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  
  const { user } = useAuthStore();
  const {
    todayClasses,
    recentCheckins,
    stats,
    isLoading,
    isCreating,
    error,
    clearError,
    getStatusColor,
    getAttendancePercentage,
    getMethodIcon,
  } = useCheckin();

  // Determine if user can access teacher/admin checkin
  const canUseTeacherCheckin = user?.role === 'admin' || user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return <Play size={14} className="text-green-600" />;
      case 'Agendada':
        return <Clock size={14} className="text-blue-600" />;
      case 'Finalizada':
        return <CheckCircle size={14} className="text-gray-600" />;
      case 'Cancelada':
        return <Pause size={14} className="text-red-600" />;
      default:
        return <Clock size={14} className="text-gray-600" />;
    }
  };

  // Handle QR Code Scanner
  const handleQRScanner = () => {
    // TODO: Implement QR code scanner functionality
    console.log('QR Scanner clicked');
  };

  // Handle Manual Checkin
  const handleManualCheckin = () => {
    if (canUseTeacherCheckin) {
      setIsTeacherModalOpen(true);
    } else if (isStudent) {
      setIsStudentModalOpen(true);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Erro ao carregar dados</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check-in</h1>
          <p className="text-gray-600 mt-1">Registro de presença dos alunos</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleQRScanner}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <QrCode size={20} />
            Scanner QR
          </button>
          <button 
            onClick={handleManualCheckin}
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            <UserCheck size={20} />
            {isCreating ? 'Processando...' : 'Check-in Manual'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Check-ins Hoje</p>
              <p className="text-2xl font-bold text-blue-600">
                {isLoading ? '...' : stats.totalCheckins}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Última hora: {recentCheckins.slice(0, 3).length}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aulas Ativas</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? '...' : stats.activeClasses}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Play size={20} className="text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600 font-medium">Em andamento</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Presença Hoje</p>
              <p className="text-2xl font-bold text-purple-600">
                {isLoading ? '...' : `${stats.attendancePercentage}%`}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              {isLoading ? '...' : `${todayClasses.reduce((sum, cls) => sum + cls.checkedInStudents, 0)}/${todayClasses.reduce((sum, cls) => sum + cls.totalStudents, 0)} alunos`}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aulas Hoje</p>
              <p className="text-2xl font-bold text-orange-600">
                {isLoading ? '...' : stats.totalClasses}
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar size={20} className="text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              {isLoading ? '...' : `${new Set(todayClasses.map(c => c.name.split(' ')[0])).size} modalidades`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Aulas de Hoje</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>Atualizado agora</span>
            </div>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : todayClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Nenhuma aula agendada para hoje</p>
              </div>
            ) : (
              todayClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-semibold text-sm ${
                      classItem.status === 'Em Andamento' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {classItem.time.split(' - ')[0]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(classItem.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(classItem.status)}`}>
                          {classItem.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{classItem.teacher} • {classItem.room}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900">
                          {classItem.checkedInStudents}/{classItem.totalStudents} alunos
                        </span>
                        <span className="text-xs text-gray-500">
                          {getAttendancePercentage(classItem.checkedInStudents, classItem.totalStudents)}% presença
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getAttendancePercentage(classItem.checkedInStudents, classItem.totalStudents)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Check-ins Recentes</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Tempo real</span>
            </div>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentCheckins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserCheck size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Nenhum check-in realizado hoje</p>
              </div>
            ) : (
              recentCheckins.map((checkin) => (
                <div key={checkin.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {checkin.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{checkin.studentName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMethodIcon(checkin.method)}</span>
                        <span className="text-xs font-medium text-gray-500">{checkin.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600">{checkin.className}</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Confirmado</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
              Ver todos os check-ins
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={handleQRScanner}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <QrCode size={20} className="text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Scanner QR Code</p>
              <p className="text-sm text-gray-500">Check-in automático</p>
            </div>
          </button>
          <button 
            onClick={handleManualCheckin}
            disabled={isCreating}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all disabled:opacity-50"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck size={20} className="text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">
                {canUseTeacherCheckin ? 'Check-in Manual' : 'Minha Presença'}
              </p>
              <p className="text-sm text-gray-500">
                {canUseTeacherCheckin ? 'Registrar presença dos alunos' : 'Confirmar minha presença'}
              </p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Lista de Presença</p>
              <p className="text-sm text-gray-500">Visualizar relatório</p>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <TeacherCheckinModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
      />
      
      <StudentCheckinModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        studentId={user?.id || ''}
      />
    </div>
  );
};

export default Checkin; 