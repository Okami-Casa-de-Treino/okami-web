import React from 'react';
import { CreditCard, DollarSign, Calendar, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Payment } from '../../../../types';
import { formatDate, formatMonthYear } from '../../../../utils';

interface StudentPaymentsListProps {
  payments: Payment[];
}

export const StudentPaymentsList: React.FC<StudentPaymentsListProps> = ({
  payments,
}) => {
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
      const year = payment.referenceMonth.split('-')[0];
      
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
      const finalAmount = payment.amount + payment.lateFee - payment.discount;
      
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
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard size={20} className="text-blue-600" />
            Histórico de Pagamentos ({payments.length})
          </h3>
          
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
                  const finalAmount = payment.amount + payment.lateFee - payment.discount;
                  
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          {getStatusIcon(payment.status)}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-gray-900 capitalize">
                              {formatReferenceMonth(payment.referenceMonth)}
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
                              <span>Venc: {formatDate(payment.dueDate)}</span>
                            </div>
                            
                            {payment.paymentDate && (
                              <div className="flex items-center gap-1">
                                <CheckCircle size={14} />
                                <span>Pago: {formatDate(payment.paymentDate)}</span>
                              </div>
                            )}
                          </div>
                          
                          {(payment.discount > 0 || payment.lateFee > 0) && (
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>Base: {formatCurrency(payment.amount)}</span>
                              {payment.discount > 0 && (
                                <span className="text-green-600">Desconto: -{formatCurrency(payment.discount)}</span>
                              )}
                              {payment.lateFee > 0 && (
                                <span className="text-red-600">Multa: +{formatCurrency(payment.lateFee)}</span>
                              )}
                            </div>
                          )}
                          
                          {payment.notes && (
                            <p className="text-xs text-gray-500 mt-1">{payment.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-500">
                        {payment.paymentMethod && (
                          <p className="font-medium">{getPaymentMethodText(payment.paymentMethod)}</p>
                        )}
                        <p className="text-xs">
                          {payment.status === 'overdue' && 'Em atraso'}
                          {payment.status === 'pending' && 'Aguardando'}
                          {payment.status === 'paid' && 'Quitado'}
                          {payment.status === 'cancelled' && 'Cancelado'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pagamento encontrado</h3>
          <p className="text-gray-500">Este aluno ainda não possui histórico de pagamentos.</p>
        </div>
      )}
    </div>
  );
}; 