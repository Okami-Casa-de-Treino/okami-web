import React from 'react';
import { User, GraduationCap, CheckCircle, CreditCard, Award } from 'lucide-react';
import { TabType } from '../hooks/useStudentDetails';
import { StudentClass, Checkin, Payment } from '../../../../types';

interface StudentDetailsTabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  classes: StudentClass[];
  checkins: Checkin[];
  payments: Payment[];
}

export const StudentDetailsTabNavigation: React.FC<StudentDetailsTabNavigationProps> = ({
  activeTab,
  onTabChange,
  classes,
  checkins,
  payments,
}) => {
  const tabs = [
    {
      id: 'details' as TabType,
      label: 'Detalhes',
      icon: User,
      count: null,
    },
    {
      id: 'belt-progression' as TabType,
      label: 'Progressão',
      icon: Award,
      count: null,
    },
    {
      id: 'classes' as TabType,
      label: 'Aulas',
      icon: GraduationCap,
      count: classes.length,
    },
    {
      id: 'checkins' as TabType,
      label: 'Check-ins',
      icon: CheckCircle,
      count: checkins.length,
    },
    {
      id: 'payments' as TabType,
      label: 'Pagamentos',
      icon: CreditCard,
      count: payments.length,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
                {tab.count !== null && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}; 