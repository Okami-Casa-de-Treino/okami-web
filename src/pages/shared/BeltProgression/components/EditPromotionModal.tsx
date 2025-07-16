import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Award, FileText, Calendar, Edit } from 'lucide-react';
import { BeltPromotion, UpdatePromotionData } from '../../../../types';
import { useBeltProgressionStore } from '../../../../stores';
import { useToast } from '../../../../hooks/useToast';
import { getBeltOptions, getMaxDegree, determineAgeGroup } from '../../../../utils/beltSystem';

interface EditPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: BeltPromotion | null;
}

interface EditForm extends UpdatePromotionData {
  promotion_date_display: string;
}

export const EditPromotionModal: React.FC<EditPromotionModalProps> = ({ 
  isOpen, 
  onClose, 
  promotion 
}) => {
  const { updatePromotion, isPromoting, error } = useBeltProgressionStore();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EditForm>({
    defaultValues: {
      promotion_type: 'regular',
      promotion_date_display: new Date().toISOString().split('T')[0],
      requirements_met: {
        technique_test: false,
        sparring_test: false,
        attendance: false,
        time_requirement: false,
      },
    },
  });

  const watchedBelt = watch('new_belt');

  // Load promotion data when modal opens
  useEffect(() => {
    if (promotion && isOpen) {
      const ageGroup = promotion.student?.birth_date 
        ? determineAgeGroup(promotion.student.birth_date) 
        : 'Adulto';
      
      setValue('new_belt', promotion.new_belt);
      setValue('new_degree', promotion.new_degree);
      setValue('promotion_type', promotion.promotion_type);
      setValue('promotion_date_display', promotion.promotion_date.split('T')[0]);
      setValue('notes', promotion.notes || '');
      setValue('certificate_url', promotion.certificate_url || '');
      setValue('requirements_met', {
        technique_test: promotion.requirements_met?.technique_test || false,
        sparring_test: promotion.requirements_met?.sparring_test || false,
        attendance: promotion.requirements_met?.attendance || false,
        time_requirement: promotion.requirements_met?.time_requirement || false,
      });
    }
  }, [promotion, isOpen, setValue]);

  // Display store errors via toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  // Get available belts and max degree
  const ageGroup = promotion?.student?.birth_date 
    ? determineAgeGroup(promotion.student.birth_date) 
    : 'Adulto';
  const availableBelts = getBeltOptions(ageGroup);
  const maxDegree = watchedBelt ? getMaxDegree(watchedBelt, ageGroup) : 1;

  const onSubmit = async (data: EditForm) => {
    if (!promotion) return;

    try {
      const submitData: UpdatePromotionData = {
        ...data,
        promotion_date: data.promotion_date_display,
      };
      
      await updatePromotion(promotion.id, submitData);
      toast.success(`Promoção de ${promotion.student?.full_name} atualizada com sucesso!`);
      reset();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar promoção';
      toast.error(errorMessage);
    }
  };

  if (!isOpen || !promotion) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Editar Promoção</h2>
              <p className="text-sm text-gray-600">
                {promotion.student?.full_name} - {promotion.previous_belt} {promotion.previous_degree}° → {promotion.new_belt} {promotion.new_degree}°
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Current Promotion Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Informações da Promoção</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Aluno:</span>
                <p className="font-medium">{promotion.student?.full_name}</p>
              </div>
              <div>
                <span className="text-gray-600">Data Original:</span>
                <p className="font-medium">{new Date(promotion.promotion_date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <span className="text-gray-600">Promovido por:</span>
                <p className="font-medium">{promotion.promoted_by_user?.username || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">Tipo Original:</span>
                <p className="font-medium capitalize">{promotion.promotion_type}</p>
              </div>
            </div>
          </div>

          {/* Belt Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Faixa
              </label>
              <select
                {...register('new_belt')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione a faixa</option>
                {availableBelts.map((belt) => (
                  <option key={belt} value={belt}>
                    {belt}
                  </option>
                ))}
              </select>
              {errors.new_belt && (
                <p className="text-red-600 text-sm mt-1">{errors.new_belt.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Novo Grau
              </label>
              <input
                type="number"
                min="0"
                max={maxDegree}
                {...register('new_degree', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Grau mínimo é 0' },
                  max: { value: maxDegree, message: `Grau máximo é ${maxDegree}` }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.new_degree && (
                <p className="text-red-600 text-sm mt-1">{errors.new_degree.message}</p>
              )}
            </div>
          </div>

          {/* Promotion Type and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Promoção
              </label>
              <select
                {...register('promotion_type')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="regular">Regular</option>
                <option value="skip_degree">Pular Grau</option>
                <option value="honorary">Honorária</option>
                <option value="correction">Correção</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Data da Promoção
              </label>
              <input
                type="date"
                {...register('promotion_date_display')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Requisitos Atendidos
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('requirements_met.technique_test')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Teste de Técnica</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('requirements_met.sparring_test')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Teste de Sparring</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('requirements_met.attendance')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Frequência</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('requirements_met.time_requirement')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Tempo Mínimo</span>
              </label>
            </div>
          </div>

          {/* Certificate URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL do Certificado
            </label>
            <input
              type="url"
              {...register('certificate_url')}
              placeholder="https://example.com/certificate.pdf"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Observações
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Observações sobre a promoção..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPromoting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPromoting ? 'Atualizando...' : 'Atualizar Promoção'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 