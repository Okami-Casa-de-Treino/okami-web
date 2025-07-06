import React from 'react';
import { Calendar, CheckCircle, DollarSign, Clock, Award } from 'lucide-react';
import { useStudentDashboard } from './hooks/useStudentDashboard';

const StudentDashboard: React.FC = () => {
  const { studentStats, upcomingClasses, recentCheckins, studentName } = useStudentDashboard();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bem-vindo, {studentName}!
        </h1>
        <p className="text-blue-100">
          Acompanhe seu progresso e mantenha-se atualizado com suas aulas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Próximas Aulas</p>
              <p className="text-2xl font-bold text-gray-900">{studentStats.upcomingClasses}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Presenças (Mês)</p>
              <p className="text-2xl font-bold text-gray-900">{studentStats.attendanceThisMonth}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faixa Atual</p>
              <p className="text-lg font-bold text-gray-900">
                {studentStats.currentBelt} {studentStats.beltDegree}° Grau
              </p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Próx. Mensalidade</p>
              <p className="text-sm font-bold text-gray-900">
                {new Date(studentStats.nextPaymentDue).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Próximas Aulas
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                    <p className="text-sm text-gray-600">{classItem.instructor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{classItem.day}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {classItem.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Presenças Recentes
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentCheckins.map((checkin) => (
                <div key={checkin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{checkin.class}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(checkin.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {checkin.time}
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

export default StudentDashboard; 