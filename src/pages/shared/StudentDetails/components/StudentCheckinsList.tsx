import React from 'react';
import { CheckCircle, Clock, MapPin, FileText } from 'lucide-react';
import { Checkin } from '../../../../types';
import { formatDate, formatTime, formatMonthYear } from '../../../../utils';

interface StudentCheckinsListProps {
  checkins: Checkin[];
}

export const StudentCheckinsList: React.FC<StudentCheckinsListProps> = ({
  checkins,
}) => {
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'qr_code':
        return '📱';
      case 'app':
        return '📲';
      case 'manual':
        return '✍️';
      default:
        return '✓';
    }
  };

  const getMethodText = (method: string): string => {
    switch (method) {
      case 'qr_code':
        return 'QR Code';
      case 'app':
        return 'App';
      case 'manual':
        return 'Manual';
      default:
        return method;
    }
  };

  const groupCheckinsByMonth = (checkins: Checkin[]) => {
    const grouped = checkins.reduce((acc, checkin) => {
      const monthYear = formatMonthYear(checkin.checkin_date);
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(checkin);
      
      return acc;
    }, {} as Record<string, Checkin[]>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  };

  const groupedCheckins = groupCheckinsByMonth(checkins);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle size={20} className="text-green-600" />
          Histórico de Check-ins ({checkins.length})
        </h3>
      </div>
      
      {checkins.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {groupedCheckins.map(([monthYear, monthCheckins]) => (
            <div key={monthYear} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 capitalize">
                  {monthYear}
                </h4>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {monthCheckins.length} check-ins
                </span>
              </div>
              
              <div className="space-y-3">
                {monthCheckins.map((checkin) => (
                  <div key={checkin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                        <span className="text-lg">{getMethodIcon(checkin.method)}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-gray-900">
                            {checkin.class?.name || 'Aula não especificada'}
                          </h5>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {getMethodText(checkin.method)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{formatTime(checkin.checkin_time)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{formatDate(checkin.checkin_date)}</span>
                          </div>
                        </div>
                        
                        {checkin.notes && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                            <FileText size={14} />
                            <span>{checkin.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {checkin.class?.teacher && (
                      <div className="text-right text-sm text-gray-500">
                        <p className="font-medium">Professor:</p>
                        <p>{checkin.class.teacher.full_name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum check-in encontrado</h3>
          <p className="text-gray-500">Este aluno ainda não realizou nenhum check-in.</p>
        </div>
      )}
    </div>
  );
}; 