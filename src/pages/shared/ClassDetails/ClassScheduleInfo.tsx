import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Class } from '../../../types';
import { StudentEnrollment } from './types';

interface ClassScheduleInfoProps {
  classData: Class;
  students: StudentEnrollment[];
  formatDaysOfWeek: (days: number[]) => string;
  formatTime: (time: string) => string;
  getDuration: (startTime: string, endTime: string) => string;
  getStudentsFillPercentage: (currentStudents: number, maxStudents: number) => number;
}

const ClassScheduleInfo: React.FC<ClassScheduleInfoProps> = ({
  classData,
  students,
  formatDaysOfWeek,
  formatTime,
  getDuration,
  getStudentsFillPercentage,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Horários e Capacidade</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Dias da Semana</label>
          <div className="flex items-center gap-2 mt-1">
            <Calendar size={16} className="text-gray-400" />
            <p className="text-gray-900">{formatDaysOfWeek(classData.days_of_week)}</p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Horário</label>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={16} className="text-gray-400" />
            <p className="text-gray-900">
              {formatTime(classData.start_time)} às {formatTime(classData.end_time)}
              <span className="ml-2 text-gray-500 text-sm">
                ({getDuration(classData.start_time, classData.end_time)})
              </span>
            </p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Capacidade de Alunos</label>
          <div className="mt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">
                {students.length}/{classData.max_students}
              </span>
              <span className="text-xs text-gray-500">
                {getStudentsFillPercentage(students.length, classData.max_students)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStudentsFillPercentage(students.length, classData.max_students)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassScheduleInfo; 