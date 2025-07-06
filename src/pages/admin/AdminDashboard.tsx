import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import StudentDashboard from '../student/StudentDashboard';
import TeacherDashboard from '../teacher/TeacherDashboard';
import { Users, UserCheck, Calendar, CheckSquare, DollarSign, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useAdminDashboard } from './hooks/useAdminDashboard';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
  trend?: string;
}

const AdminDashboard: React.FC = () => {
  const { stats: dashboardStats, recentActivities, upcomingClasses, isLoading } = useAdminDashboard();

  // Map dashboard stats to StatCard format
  const stats: StatCard[] = [
    {
      title: 'Total de Alunos',
      value: dashboardStats[0]?.value || 0,
      icon: <Users size={24} />,
      color: 'blue',
      description: dashboardStats[0]?.description || '',
      trend: dashboardStats[0]?.trend || '0'
    },
    {
      title: 'Professores Ativos',
      value: dashboardStats[1]?.value || 0,
      icon: <UserCheck size={24} />,
      color: 'green',
      description: dashboardStats[1]?.description || '',
      trend: dashboardStats[1]?.trend || '0%'
    },
    {
      title: 'Aulas Ativas',
      value: dashboardStats[2]?.value || 0,
      icon: <Calendar size={24} />,
      color: 'purple',
      description: dashboardStats[2]?.description || '',
      trend: dashboardStats[2]?.trend || '0%'
    },
    {
      title: 'Check-ins Hoje',
      value: dashboardStats[3]?.value || 0,
      icon: <CheckSquare size={24} />,
      color: 'orange',
      description: dashboardStats[3]?.description || '',
      trend: dashboardStats[3]?.trend || '0'
    },
    {
      title: 'Receita Mensal',
      value: dashboardStats[4]?.value || 'R$ 0,00',
      icon: <DollarSign size={24} />,
      color: 'emerald',
      description: dashboardStats[4]?.description || '',
      trend: dashboardStats[4]?.trend || 'R$ 0,00'
    },
    {
      title: 'Pagamentos Pendentes',
      value: dashboardStats[5]?.value || 0,
      icon: <AlertTriangle size={24} />,
      color: 'red',
      description: dashboardStats[5]?.description || '',
      trend: dashboardStats[5]?.trend || '0'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 text-white',
      green: 'from-green-500 to-green-600 text-white',
      purple: 'from-purple-500 to-purple-600 text-white',
      orange: 'from-orange-500 to-orange-600 text-white',
      emerald: 'from-emerald-500 to-emerald-600 text-white',
      red: 'from-red-500 to-red-600 text-white'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Visão geral do sistema</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do sistema</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>Atualizado agora</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                {stat.description && (
                  <p className="text-sm text-gray-500">{stat.description}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(stat.color)} shadow-sm`}>
                {stat.icon}
              </div>
            </div>
            {stat.trend && (
              <div className="mt-4 flex items-center">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">{stat.trend}</span>
                <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Atividades Recentes</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-12 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">{activity.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.activity}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                    activity.type === 'checkin' ? 'bg-green-100 text-green-800' :
                    activity.type === 'payment' ? 'bg-blue-100 text-blue-800' :
                    activity.type === 'student' ? 'bg-purple-100 text-purple-800' :
                    activity.type === 'class' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.type === 'checkin' ? 'Check-in' :
                     activity.type === 'payment' ? 'Pagamento' :
                     activity.type === 'student' ? 'Aluno' :
                     activity.type === 'class' ? 'Aula' : 'Geral'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Próximas Aulas</h2>
          <div className="space-y-4">
            {upcomingClasses.map((classItem, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                <div className="flex-shrink-0">
                                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-semibold text-sm ${
                      classItem.status === 'next' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {classItem.time}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                  <p className="text-sm text-gray-600">{classItem.teacher}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500">{classItem.students} alunos</span>
                    {classItem.status === 'next' && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Próxima
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  console.log(user);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Render different dashboards based on user role
  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'admin':
    case 'receptionist':
    default:
      return <AdminDashboard />;
  }
};

export default Dashboard; 