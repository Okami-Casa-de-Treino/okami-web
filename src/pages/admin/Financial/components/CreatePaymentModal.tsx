import React, { useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStudentStore } from '../../../../stores/studentStore';

const createPaymentSchema = z.object({
  student_id: z.string().min(1, 'Aluno é obrigatório'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  due_date: z.string().min(1, 'Data de vencimento é obrigatória'),
  reference_month: z.string().min(1, 'Mês de referência é obrigatório'),
  discount: z.number().min(0).optional().nullable(),
  notes: z.string().optional().nullable()
});

type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePaymentFormData) => Promise<boolean>;
  loading: boolean;
  selectedStudentId?: string;
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  selectedStudentId
}) => {
  const { students, fetchStudents } = useStudentStore();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CreatePaymentFormData>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      student_id: selectedStudentId || '',
      amount: 0,
      due_date: '',
      reference_month: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      
      // Set default due date to end of current month
      const now = new Date();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const defaultDueDate = lastDay.toISOString().split('T')[0];
      
      // Set default reference month to current month
      const defaultReferenceMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      setValue('due_date', defaultDueDate);
      setValue('reference_month', defaultReferenceMonth);
      
      if (selectedStudentId) {
        setValue('student_id', selectedStudentId);
      }
    }
  }, [isOpen, fetchStudents, selectedStudentId, setValue]);

  const onFormSubmit = async (data: CreatePaymentFormData) => {
    console.log('Form data being submitted:', data);
    
    const success = await onSubmit(data);
    if (success) {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nova Cobrança</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aluno *
            </label>
            <select
              {...register('student_id')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!!selectedStudentId}
            >
              <option value="">Selecione um aluno</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
            {errors.student_id && (
              <p className="text-red-500 text-sm mt-1">{errors.student_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('amount', { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0,00"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Vencimento *
            </label>
            <input
              type="date"
              {...register('due_date')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.due_date && (
              <p className="text-red-500 text-sm mt-1">{errors.due_date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mês de Referência *
            </label>
            <input
              type="month"
              {...register('reference_month')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.reference_month && (
              <p className="text-red-500 text-sm mt-1">{errors.reference_month.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desconto (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('discount', { 
                setValueAs: (value) => value === '' || value === null || value === undefined ? null : Number(value)
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0,00"
            />
            {errors.discount && (
              <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              {...register('notes')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Observações sobre o pagamento..."
            />
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Criar Cobrança
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 