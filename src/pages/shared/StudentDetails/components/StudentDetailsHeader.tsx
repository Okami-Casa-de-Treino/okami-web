import React from 'react';
import { ArrowLeft, Edit, Trash2, User, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../../../types';
import { calculateAge } from '../../../../utils';

interface StudentDetailsHeaderProps {
  student: Student;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  getStatusColor: (status: string) => string;
}

export const StudentDetailsHeader: React.FC<StudentDetailsHeaderProps> = ({
  student,
  onEdit,
  onDelete,
  getStatusColor,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/students');
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'suspended':
        return 'Suspenso';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={16} />
            Editar
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} />
            Excluir
          </button>
        </div>
      </div>

      <div className="flex items-start gap-6">
        {/* Student Avatar */}
        <div className="flex-shrink-0">
          {student.photo_url ? (
            <img
              src={student.photo_url}
              alt={student.full_name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-gray-200">
              <User size={32} className="text-blue-600" />
            </div>
          )}
        </div>

        {/* Student Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{student.full_name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
              {getStatusText(student.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{calculateAge(student.birth_date)} anos</span>
            </div>
            
            {student.email && (
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a 
                  href={`mailto:${student.email}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {student.email}
                </a>
              </div>
            )}
            
            {student.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a 
                  href={`tel:${student.phone}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {student.phone}
                </a>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm">Matrícula:</span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {student.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 