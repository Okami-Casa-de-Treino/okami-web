import React from 'react';
import { useFinancial } from './hooks/useFinancial';
import { Payment } from '../../../types';
import { FinancialHeader } from './components/FinancialHeader';
import { FinancialFilters } from './components/FinancialFilters';
import { FinancialStats } from './components/FinancialStats';
import { FinancialTable } from './components/FinancialTable';
import { CreatePaymentModal } from './components/CreatePaymentModal';
import { MarkAsPaidModal } from './components/MarkAsPaidModal';
import { GenerateMonthlyModal } from './components/GenerateMonthlyModal';

export const FinancialScreen: React.FC = () => {
  const {
    // Data
    payments,
    overduePayments,
    loading,
    error,
    pagination,
    
    // Filters
    filters,
    searchTerm,
    setSearchTerm,
    setFilters,
    clearFilters,
    
    // Pagination
    currentPage,
    setCurrentPage,
    
    // Actions
    handleCreatePayment,
    handleMarkAsPaid,
    handleEditPayment,
    handleDeletePayment,
    handleGenerateMonthly,
    
    // Modals
    showCreateModal,
    setShowCreateModal,
    showMarkAsPaidModal,
    setShowMarkAsPaidModal,
    showGenerateModal,
    setShowGenerateModal,
    selectedPayment,
    setSelectedPayment,
    
    // Stats
    stats
  } = useFinancial();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-medium">Erro ao carregar dados financeiros</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FinancialHeader 
        overdueCount={overduePayments.length}
        onCreatePayment={() => setShowCreateModal(true)}
        onGenerateMonthly={() => setShowGenerateModal(true)}
      />
      
      <FinancialFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />
      
      <FinancialStats 
        stats={stats}
        loading={loading.list}
      />
      
      <FinancialTable 
        payments={payments}
        loading={loading.list}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onMarkAsPaid={(payment: Payment) => {
          setSelectedPayment(payment);
          setShowMarkAsPaidModal(true);
        }}
        onEdit={handleEditPayment}
        onDelete={handleDeletePayment}
      />
      
      {/* Modals */}
      {showCreateModal && (
        <CreatePaymentModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePayment}
          loading={loading.create}
        />
      )}
      
      {showMarkAsPaidModal && selectedPayment && (
        <MarkAsPaidModal 
          isOpen={showMarkAsPaidModal}
          onClose={() => {
            setShowMarkAsPaidModal(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onSubmit={handleMarkAsPaid}
          loading={loading.markPaid}
        />
      )}
      
      {showGenerateModal && (
        <GenerateMonthlyModal 
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onSubmit={handleGenerateMonthly}
          loading={loading.generateMonthly}
        />
      )}
    </div>
  );
}; 