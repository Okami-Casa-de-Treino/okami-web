import React from 'react';
import { Award, Users, TrendingUp, Calendar } from 'lucide-react';
import { BeltOverview } from '../../../../types';

interface BeltProgressionStatsProps {
  beltOverview: BeltOverview | null;
}

export const BeltProgressionStats: React.FC<BeltProgressionStatsProps> = ({ beltOverview }) => {
  if (!beltOverview || !beltOverview.summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const { summary } = beltOverview;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Active Students */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Alunos Ativos</p>
            <p className="text-2xl font-bold text-gray-900">{summary.total_active_students || 0}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="text-blue-600" size={20} />
          </div>
        </div>
      </div>

      {/* Unique Belt Levels */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Níveis de Faixa</p>
            <p className="text-2xl font-bold text-gray-900">{summary.unique_belt_levels || 0}</p>
          </div>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Award className="text-yellow-600" size={20} />
          </div>
        </div>
      </div>

      {/* Recent Promotions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Promoções Recentes</p>
            <p className="text-2xl font-bold text-gray-900">{summary.recent_promotions || 0}</p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="text-green-600" size={20} />
          </div>
        </div>
      </div>

      {/* This Month Promotions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Promoções Este Mês</p>
            <p className="text-2xl font-bold text-gray-900">{summary.promotions_this_month || 0}</p>
          </div>
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calendar className="text-purple-600" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}; 