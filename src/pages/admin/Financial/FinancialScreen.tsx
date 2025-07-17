import React, { useState } from 'react';
import { useFinancial } from './hooks/useFinancial';
import { useExpenses } from './hooks/useExpenses';
import { Payment, Expense } from '../../../types';
import { FinancialHeader } from './components/FinancialHeader';
import { FinancialFilters } from './components/FinancialFilters';
import { FinancialStats } from './components/FinancialStats';
import { FinancialTable } from './components/FinancialTable';
import { CreatePaymentModal } from './components/CreatePaymentModal';
import { MarkAsPaidModal } from './components/MarkAsPaidModal';
import { GenerateMonthlyModal } from './components/GenerateMonthlyModal';
import { ExpenseTable } from './components/ExpenseTable';
import { CreateExpenseModal } from './components/CreateExpenseModal';

export const FinancialScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'expenses'>('payments');

  const {
    // Data
    payments,
    overduePayments,
    loading: paymentLoading,
    error: paymentError,
    pagination: paymentPagination,
    
    // Filters
    filters: paymentFilters,
    searchTerm: paymentSearchTerm,
    setSearchTerm: setPaymentSearchTerm,
    setFilters: setPaymentFilters,
    clearFilters: clearPaymentFilters,
    
    // Pagination
    currentPage: paymentCurrentPage,
    setCurrentPage: setPaymentCurrentPage,
    
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
    stats: paymentStats
  } = useFinancial();

  const {
    // Data
    expenses,
    loading: expenseLoading,
    error: expenseError,
    pagination: expensePagination,
    
    // Pagination
    currentPage: expenseCurrentPage,
    setCurrentPage: setExpenseCurrentPage,
    
    // Actions
    handleCreateExpense,
    handleDeleteExpense,
    
    // Modals
    showCreateModal: showCreateExpenseModal,
    setShowCreateModal: setShowCreateExpenseModal,
    showEditModal: showEditExpenseModal,
    setShowEditModal: setShowEditExpenseModal,
    selectedExpense,
    setSelectedExpense
  } = useExpenses();

  if (paymentError || expenseError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-medium">Erro ao carregar dados financeiros</p>
          <p className="text-gray-500 text-sm mt-1">{paymentError || expenseError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pagamentos
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'expenses'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Despesas
          </button>
        </nav>
      </div>

      {activeTab === 'payments' ? (
        <>
          <FinancialHeader 
            overdueCount={overduePayments.length}
            onCreatePayment={() => setShowCreateModal(true)}
            onGenerateMonthly={() => setShowGenerateModal(true)}
          />
          
          <FinancialFilters 
            searchTerm={paymentSearchTerm}
            onSearchChange={setPaymentSearchTerm}
            filters={paymentFilters}
            onFiltersChange={setPaymentFilters}
            onClearFilters={clearPaymentFilters}
          />
          
          <FinancialStats 
            stats={paymentStats}
            loading={paymentLoading.list}
          />
          
          <FinancialTable 
            payments={payments}
            loading={paymentLoading.list}
            pagination={paymentPagination}
            currentPage={paymentCurrentPage}
            onPageChange={setPaymentCurrentPage}
            onMarkAsPaid={(payment: Payment) => {
              setSelectedPayment(payment);
              setShowMarkAsPaidModal(true);
            }}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Despesas</h1>
              <p className="text-gray-600">Gerencie as despesas da academia</p>
            </div>
            <button
              onClick={() => setShowCreateExpenseModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <span>Nova Despesa</span>
            </button>
          </div>
          
          <ExpenseTable 
            expenses={expenses}
            loading={expenseLoading.list}
            pagination={expensePagination}
            currentPage={expenseCurrentPage}
            onPageChange={setExpenseCurrentPage}
            onEdit={(expense: Expense) => {
              setSelectedExpense(expense);
              setShowEditExpenseModal(true);
            }}
            onDelete={handleDeleteExpense}
            onView={(expense: Expense) => {
              // TODO: Implement view modal
              console.log('View expense:', expense);
            }}
          />
        </>
      )}
      
      {/* Payment Modals */}
      {showCreateModal && (
        <CreatePaymentModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePayment}
          loading={paymentLoading.create}
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
          loading={paymentLoading.markPaid}
        />
      )}
      
      {showGenerateModal && (
        <GenerateMonthlyModal 
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onSubmit={handleGenerateMonthly}
          loading={paymentLoading.generateMonthly}
        />
      )}

      {/* Expense Modals */}
      {showCreateExpenseModal && (
        <CreateExpenseModal 
          isOpen={showCreateExpenseModal}
          onClose={() => setShowCreateExpenseModal(false)}
          onSubmit={handleCreateExpense}
          loading={expenseLoading.create}
        />
      )}
      
      {showEditExpenseModal && selectedExpense && (
        <CreateExpenseModal 
          isOpen={showEditExpenseModal}
          onClose={() => {
            setShowEditExpenseModal(false);
            setSelectedExpense(null);
          }}
          onSubmit={handleCreateExpense}
          loading={expenseLoading.create}
        />
      )}
    </div>
  );
}; 