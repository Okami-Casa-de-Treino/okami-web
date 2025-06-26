import React from 'react';
import { Download, BarChart3, PieChart, TrendingUp, Calendar, Users, FileText, Filter, Eye, Clock, CheckCircle } from 'lucide-react';

const Reports: React.FC = () => {
  const reportTypes = [
    {
      id: '1',
      title: 'Relatório de Frequência',
      description: 'Check-ins e presenças dos alunos',
      icon: <BarChart3 size={24} />,
      color: 'blue',
      lastGenerated: '2024-01-15',
      status: 'Disponível',
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'Relatório Financeiro',
      description: 'Receitas, pagamentos e inadimplência',
      icon: <TrendingUp size={24} />,
      color: 'green',
      lastGenerated: '2024-01-14',
      status: 'Disponível',
      size: '1.8 MB'
    },
    {
      id: '3',
      title: 'Relatório de Alunos',
      description: 'Cadastros, matrículas e status',
      icon: <PieChart size={24} />,
      color: 'purple',
      lastGenerated: '2024-01-13',
      status: 'Disponível',
      size: '3.2 MB'
    },
    {
      id: '4',
      title: 'Relatório de Professores',
      description: 'Performance e aulas ministradas',
      icon: <Users size={24} />,
      color: 'orange',
      lastGenerated: '2024-01-12',
      status: 'Processando',
      size: '1.5 MB'
    },
    {
      id: '5',
      title: 'Relatório de Aulas',
      description: 'Ocupação e frequência das turmas',
      icon: <Calendar size={24} />,
      color: 'indigo',
      lastGenerated: '2024-01-11',
      status: 'Disponível',
      size: '2.1 MB'
    },
    {
      id: '6',
      title: 'Relatório Executivo',
      description: 'Visão geral e KPIs do negócio',
      icon: <FileText size={24} />,
      color: 'red',
      lastGenerated: '2024-01-10',
      status: 'Disponível',
      size: '4.7 MB'
    }
  ];

  const recentReports = [
    {
      id: '1',
      name: 'Frequência Janeiro 2024',
      type: 'Frequência',
      generatedAt: '2024-01-15 14:30',
      downloadCount: 12,
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Financeiro Dezembro 2023',
      type: 'Financeiro',
      generatedAt: '2024-01-14 09:15',
      downloadCount: 8,
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Alunos Ativos Janeiro',
      type: 'Alunos',
      generatedAt: '2024-01-13 16:45',
      downloadCount: 15,
      size: '3.2 MB'
    },
    {
      id: '4',
      name: 'Executivo Q4 2023',
      type: 'Executivo',
      generatedAt: '2024-01-10 11:20',
      downloadCount: 25,
      size: '4.7 MB'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      indigo: 'from-indigo-500 to-indigo-600',
      red: 'from-red-500 to-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível':
        return 'bg-green-100 text-green-800';
      case 'Processando':
        return 'bg-yellow-100 text-yellow-800';
      case 'Erro':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Disponível':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'Processando':
        return <Clock size={14} className="text-yellow-600" />;
      case 'Erro':
        return <Clock size={14} className="text-red-600" />;
      default:
        return <Clock size={14} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Análises e estatísticas do sistema</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            Filtros Avançados
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm">
            <Download size={20} />
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Relatórios Gerados</p>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Este mês</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-green-600">156</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Download size={20} className="text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600 font-medium">+23% vs mês anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tipos Disponíveis</p>
              <p className="text-2xl font-bold text-purple-600">6</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Categorias ativas</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Último Relatório</p>
              <p className="text-2xl font-bold text-orange-600">Hoje</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock size={20} className="text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">14:30</span>
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Tipos de Relatórios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => (
            <div key={report.id} className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(report.color)} text-white shadow-sm`}>
                  {report.icon}
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(report.status)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Último:</span>
                  <span>{formatDate(report.lastGenerated)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tamanho:</span>
                  <span>{report.size}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={report.status === 'Processando'}
                >
                  <Download size={16} />
                  {report.status === 'Processando' ? 'Processando...' : 'Gerar'}
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Relatórios Recentes</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 truncate">{report.name}</p>
                    <span className="text-xs text-gray-500">{report.size}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600">{report.type}</p>
                    <span className="text-xs text-gray-500">{report.downloadCount} downloads</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatDateTime(report.generatedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Filtros de Relatório</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Período</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option>Último mês</option>
                <option>Últimos 3 meses</option>
                <option>Último semestre</option>
                <option>Último ano</option>
                <option>Personalizado</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tipo de Relatório</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option>Todos</option>
                <option>Frequência</option>
                <option>Financeiro</option>
                <option>Alunos</option>
                <option>Professores</option>
                <option>Aulas</option>
                <option>Executivo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option>Todos</option>
                <option>Disponível</option>
                <option>Processando</option>
                <option>Erro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Formato</label>
              <div className="flex gap-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">PDF</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Excel</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">CSV</span>
                </label>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 