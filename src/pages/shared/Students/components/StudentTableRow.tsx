import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Student } from '../../../../types';

interface StudentTableRowProps {
  student: Student;
  isDeleting: boolean;
  onDeleteStudent: (id: string) => void;
}

export const StudentTableRow: React.FC<StudentTableRowProps> = ({
  student,
  isDeleting,
  onDeleteStudent
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'suspended':
        return 'Suspenso';
      default:
        return 'Inativo';
    }
  };

  const handleEditStudent = () => {
    if (student.id) {
      navigate(`/students/edit/${student.id}`);
    }
  };

  const handleViewStudent = () => {
    if (student.id) {
      navigate(`/students/${student.id}`);
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
            {student.full_name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{student.full_name}</p>
            <p className="text-sm text-gray-500">ID: {student.id?.slice(0, 8) || 'N/A'}...</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {student.belt || 'Branca'}
        </span>
      </td>
      <td className="py-4 px-6">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
          {getStatusLabel(student.status)}
        </span>
      </td>
      <td className="py-4 px-6 text-gray-900">{student.phone || '-'}</td>
      <td className="py-4 px-6 font-medium text-gray-900">
        {student.monthly_fee ? `R$ ${student.monthly_fee.toFixed(2)}` : '-'}
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleViewStudent}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Ver detalhes"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={handleEditStudent}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => student.id && onDeleteStudent(student.id)}
            disabled={isDeleting || !student.id}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}; 