import React, { useState } from 'react';
import { CreditCard, DollarSign, Calendar, AlertCircle, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';
import { Payment, Student } from '../../../../types';
import { formatDate, formatMonthYear } from '../../../../utils';
import { CreatePaymentModal } from '../../../admin/Financial/components/CreatePaymentModal';
import { MarkAsPaidModal } from '../../../admin/Financial/components/MarkAsPaidModal';
import { usePaymentStore } from '../../../../stores/paymentStore';

interface CreatePaymentData {
  student_id: string;
  amount: number;
  due_date: string;
  reference_month: string;
  discount?: number;
  notes?: string;
}

interface MarkAsPaidData {
  paymentMethod: 'cash' | 'card' | 'pix' | 'bank_transfer';
  paymentDate?: string;
}

interface StudentPaymentsListProps {
  payments: Payment[];
  student: Student;
  onRefresh: () => void | Promise<void>;
}

export const StudentPaymentsList: React.FC<StudentPaymentsListProps> = ({
  payments,
  student,
  onRefresh
}) => {
  const { createPayment, markAsPaid, loading } = usePaymentStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleCreatePayment = async (modalData: CreatePaymentData): Promise<boolean> => {
    try {
      console.log('Payment data being submitted:', modalData);
      
      const result = await createPayment(modalData);
      if (result) {
        setShowCreateModal(false);
        onRefresh(); // Refresh the payments list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating payment:', error);
      return false;
    }
  };

  const handleMarkAsPaid = async (paymentId: string, data: MarkAsPaidData): Promise<boolean> => {
    try {
      const result = await markAsPaid(paymentId, data.paymentMethod, data.paymentDate);
      if (result) {
        setShowMarkAsPaidModal(false);
        setSelectedPayment(null);
        onRefresh(); // Refresh the payments list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      return false;
    }
  };

  const handleMarkPaymentAsPaid = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowMarkAsPaidModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'overdue':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'cancelled':
        return <XCircle size={20} className="text-gray-600" />;
      default:
        return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Em Atraso';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method?: string): string => {
    if (!method) return 'Não especificado';
    
    switch (method) {
      case 'cash':
        return 'Dinheiro';
      case 'card':
        return 'Cartão';
      case 'pix':
        return 'PIX';
      case 'bank_transfer':
        return 'Transferência';
      default:
        return method;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatReferenceMonth = (referenceMonth: string): string => {
    const [year, month] = referenceMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return formatMonthYear(date);
  };

  const groupPaymentsByYear = (payments: Payment[]) => {
    const grouped = payments.reduce((acc, payment) => {
      const year = payment.reference_month.split('-')[0];
      
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(payment);
      
      return acc;
    }, {} as Record<string, Payment[]>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  };

  const calculateTotals = (payments: Payment[]) => {
    return payments.reduce((acc, payment) => {
      const finalAmount = payment.amount + payment.late_fee - payment.discount;
      
      switch (payment.status) {
        case 'paid':
          acc.paid += finalAmount;
          break;
        case 'pending':
          acc.pending += finalAmount;
          break;
        case 'overdue':
          acc.overdue += finalAmount;
          break;
      }
      
      return acc;
    }, { paid: 0, pending: 0, overdue: 0 });
  };

  const groupedPayments = groupPaymentsByYear(payments);
  const totals = calculateTotals(payments);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" />
              Histórico de Pagamentos ({payments.length})
            </h3>
            
            <div className="flex items-center gap-4">
              {payments.length > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Pago: {formatCurrency(totals.paid)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Pendente: {formatCurrency(totals.pending)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Atraso: {formatCurrency(totals.overdue)}</span>
                  </div>
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={16} />
                Nova Cobrança
              </button>
            </div>
          </div>
        </div>
        
        {payments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {groupedPayments.map(([year, yearPayments]) => (
              <div key={year} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{year}</h4>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {yearPayments.length} pagamentos
                  </span>
                </div>
                
                <div className="space-y-3">
                  {yearPayments.map((payment) => {
                    const finalAmount = payment.amount + payment.late_fee - payment.discount;
                    
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            {getStatusIcon(payment.status)}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-semibold text-gray-900 capitalize">
                                {formatReferenceMonth(payment.reference_month)}
                              </h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                {getStatusText(payment.status)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <DollarSign size={14} />
                                <span className="font-semibold">{formatCurrency(finalAmount)}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>Venc: {formatDate(payment.due_date)}</span>
                              </div>
                              
                              {payment.payment_date && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle size={14} />
                                  <span>Pago: {formatDate(payment.payment_date)}</span>
                                </div>
                              )}
                              
                              {payment.payment_method && (
                                <div className="flex items-center gap-1">
                                  <CreditCard size={14} />
                                  <span>{getPaymentMethodText(payment.payment_method)}</span>
                                </div>
                              )}
                            </div>
                            
                            {payment.notes && (
                              <p className="text-sm text-gray-500 mt-1">{payment.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Button for Pending/Overdue Payments */}
                        {(payment.status === 'pending' || payment.status === 'overdue') && (
                          <button
                            type="button"
                            onClick={() => handleMarkPaymentAsPaid(payment)}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Marcar como Pago
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={32} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pagamento encontrado</h4>
            <p className="text-gray-500 mb-6">Este aluno ainda não possui histórico de pagamentos.</p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Criar Primeira Cobrança
            </button>
          </div>
        )}
      </div>

      {/* Create Payment Modal */}
      {showCreateModal && (
        <CreatePaymentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => handleCreatePayment(data)}
          loading={loading.create}
          selectedStudentId={student.id}
        />
      )}

      {/* Mark as Paid Modal */}
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
    </>
  );
}; 