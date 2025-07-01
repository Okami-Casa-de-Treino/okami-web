import React from 'react';
import { Clock, Users, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Checkin } from '../../../types';

// Configure dayjs to use Portuguese locale
dayjs.locale('pt-br');

interface ClassCheckinsListProps {
  checkins: Checkin[];
}

const ClassCheckinsList: React.FC<ClassCheckinsListProps> = ({
  checkins,
}) => {
  const formatCheckinDate = (timestamp: string): string => {
    return dayjs(timestamp).format('DD/MM/YYYY');
  };

  const formatCheckinTime = (timestamp: string): string => {
    return dayjs(timestamp).format('HH:mm');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Histórico de Presenças ({checkins.length})
        </h3>
      </div>
      
      {checkins.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Aluno</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Data</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Horário</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Método</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {checkins.map((checkin) => (
                <tr key={checkin.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users size={16} className="text-green-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {checkin.student?.full_name || 'Aluno não encontrado'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-900">{formatCheckinDate(checkin.checkin_time)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-900">{formatCheckinTime(checkin.checkin_time)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      checkin.method === 'qr_code' 
                        ? 'bg-blue-100 text-blue-800' 
                        : checkin.method === 'manual'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {checkin.method === 'qr_code' ? 'QR Code' : 
                       checkin.method === 'manual' ? 'Manual' : 
                       checkin.method}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma presença registrada</h3>
          <p className="text-gray-500">Esta aula ainda não possui registros de presença.</p>
        </div>
      )}
    </div>
  );
};

export default ClassCheckinsList; 