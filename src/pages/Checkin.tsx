import React from 'react';
import { QrCode, UserCheck, Clock, Users, Calendar, CheckCircle, Play, Pause } from 'lucide-react';

const Checkin: React.FC = () => {
  // Mock data for today's classes
  const todayClasses = [
    {
      id: '1',
      name: 'Karatê Infantil',
      teacher: 'Sensei Carlos',
      time: '09:00 - 10:00',
      totalStudents: 15,
      checkedInStudents: 12,
      status: 'Em Andamento',
      room: 'Dojo 1',
      level: 'Iniciante'
    },
    {
      id: '2',
      name: 'Judô Adulto',
      teacher: 'Sensei Ana',
      time: '14:00 - 15:30',
      totalStudents: 22,
      checkedInStudents: 18,
      status: 'Agendada',
      room: 'Dojo 2',
      level: 'Intermediário'
    },
    {
      id: '3',
      name: 'Aikido Avançado',
      teacher: 'Sensei Roberto',
      time: '18:00 - 19:30',
      totalStudents: 8,
      checkedInStudents: 0,
      status: 'Agendada',
      room: 'Dojo 3',
      level: 'Avançado'
    },
    {
      id: '4',
      name: 'Defesa Pessoal',
      teacher: 'Sensei Carlos',
      time: '20:00 - 21:00',
      totalStudents: 12,
      checkedInStudents: 0,
      status: 'Agendada',
      room: 'Dojo 1',
      level: 'Todos os níveis'
    }
  ];

  // Mock data for recent check-ins
  const recentCheckins = [
    {
      id: '1',
      studentName: 'João Silva',
      className: 'Karatê Infantil',
      time: '08:55',
      method: 'QR Code',
      avatar: '👨',
      status: 'success'
    },
    {
      id: '2',
      studentName: 'Maria Santos',
      className: 'Karatê Infantil',
      time: '08:52',
      method: 'Manual',
      avatar: '👩',
      status: 'success'
    },
    {
      id: '3',
      studentName: 'Pedro Lima',
      className: 'Karatê Infantil',
      time: '08:48',
      method: 'QR Code',
      avatar: '👦',
      status: 'success'
    },
    {
      id: '4',
      studentName: 'Ana Costa',
      className: 'Karatê Infantil',
      time: '08:45',
      method: 'Manual',
      avatar: '👩',
      status: 'success'
    },
    {
      id: '5',
      studentName: 'Carlos Oliveira',
      className: 'Karatê Infantil',
      time: '08:42',
      method: 'QR Code',
      avatar: '👨',
      status: 'success'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return 'bg-green-100 text-green-800';
      case 'Agendada':
        return 'bg-blue-100 text-blue-800';
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  const getAttendancePercentage = (checkedIn: number, total: number) => {
    return total > 0 ? Math.round((checkedIn / total) * 100) : 0;
  };

  const getMethodIcon = (method: string) => {
    return method === 'QR Code' ? '📱' : '✋';
  };

  const totalCheckins = recentCheckins.length;
  const totalStudentsToday = todayClasses.reduce((sum, cls) => sum + cls.totalStudents, 0);
  const totalCheckedIn = todayClasses.reduce((sum, cls) => sum + cls.checkedInStudents, 0);
  const activeClasses = todayClasses.filter(cls => cls.status === 'Em Andamento').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check-in</h1>
          <p className="text-gray-600 mt-1">Registro de presença dos alunos</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <QrCode size={20} />
            Scanner QR
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm">
            <UserCheck size={20} />
            Check-in Manual
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Check-ins Hoje</p>
              <p className="text-2xl font-bold text-blue-600">{totalCheckins}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Última hora: 3</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aulas Ativas</p>
              <p className="text-2xl font-bold text-green-600">{activeClasses}</p>
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
                {totalStudentsToday > 0 ? Math.round((totalCheckedIn / totalStudentsToday) * 100) : 0}%
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">{totalCheckedIn}/{totalStudentsToday} alunos</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aulas Hoje</p>
              <p className="text-2xl font-bold text-orange-600">{todayClasses.length}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar size={20} className="text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">4 modalidades</span>
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
            {todayClasses.map((classItem) => (
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
            ))}
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
            {recentCheckins.map((checkin) => (
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
            ))}
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
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
            <div className="p-2 bg-blue-100 rounded-lg">
              <QrCode size={20} className="text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Scanner QR Code</p>
              <p className="text-sm text-gray-500">Check-in automático</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck size={20} className="text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Check-in Manual</p>
              <p className="text-sm text-gray-500">Registrar presença</p>
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
    </div>
  );
};

export default Checkin; 