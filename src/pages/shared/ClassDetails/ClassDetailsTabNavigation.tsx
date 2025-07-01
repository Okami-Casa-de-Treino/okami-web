import React from 'react';
import { Checkin } from '../../../types';
import { StudentEnrollment, TabType } from './types';

interface ClassDetailsTabNavigationProps {
  activeTab: TabType;
  students: StudentEnrollment[];
  checkins: Checkin[];
  onTabChange: (tab: TabType) => void;
}

const ClassDetailsTabNavigation: React.FC<ClassDetailsTabNavigationProps> = ({
  activeTab,
  students,
  checkins,
  onTabChange,
}) => {
  const getTabClassName = (tab: TabType) => {
    return `py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
      activeTab === tab
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;
  };

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onTabChange('details')}
            className={getTabClassName('details')}
          >
            Detalhes
          </button>
          <button
            onClick={() => onTabChange('students')}
            className={getTabClassName('students')}
          >
            Alunos ({students.length})
          </button>
          <button
            onClick={() => onTabChange('checkins')}
            className={getTabClassName('checkins')}
          >
            Presenças ({checkins.length})
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ClassDetailsTabNavigation; 