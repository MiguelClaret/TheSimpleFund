import React, { useState } from 'react';
import { PlusIcon, ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '../../common/Card';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import api from '../../../services/api';

interface CreateFundFormProps {
  onFundCreated?: () => void;
}

interface FundFormData {
  name: string;
  symbol: string;
  description: string;
  targetAmount: string;
  maxSupply: string;
  price: string;
}

const CreateFundForm: React.FC<CreateFundFormProps> = ({ onFundCreated }) => {
  const [formData, setFormData] = useState<FundFormData>({
    name: '',
    symbol: '',
    description: '',
    targetAmount: '',
    maxSupply: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        targetAmount: formData.targetAmount ? Number(formData.targetAmount) : null,
        maxSupply: Number(formData.maxSupply),
        price: Number(formData.price)
      };

      await api.post('/fund', submitData);
      
      setSuccess(true);
      setFormData({
        name: '',
        symbol: '',
        description: '',
        targetAmount: '',
        maxSupply: '',
        price: ''
      });
      
      if (onFundCreated) {
        onFundCreated();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao criar fundo');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FundFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  return (
    <GlassCard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Criar Novo Fundo</h3>
          <div className="text-sm text-gray-400">
            Preencha os dados do fundo
          </div>
        </div>

        {/* Warning about approval */}
        <div className="glass-card p-4 border border-yellow-400/30">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-300">
              <p className="font-medium">Aprovação Necessária</p>
              <p className="text-yellow-200 mt-1">
                O fundo criado será enviado para aprovação do gestor antes de ficar disponível para investimento.
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="glass-card p-4 border border-green-400/30">
            <div className="flex items-start space-x-3">
              <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-300">
                <p className="font-medium">Fundo criado com sucesso!</p>
                <p className="text-green-200 mt-1">
                  Aguarde a aprovação do gestor para que o fundo fique disponível.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="glass-card p-4 border border-red-400/30">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-300">
                <p className="font-medium">Erro ao criar fundo</p>
                <p className="text-red-200 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-white border-b border-white/10 pb-2">
              Informações Básicas
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome do Fundo"
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
                placeholder="Ex: Fundo de Recebíveis Premium"
              />
              
              <Input
                label="Símbolo"
                type="text"
                value={formData.symbol}
                onChange={handleInputChange('symbol')}
                required
                placeholder="Ex: FRPREM"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={handleInputChange('description')}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-colors"
                placeholder="Descrição detalhada do fundo e sua estratégia..."
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-white border-b border-white/10 pb-2">
              Informações Financeiras
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Meta de Captação (R$)"
                type="number"
                value={formData.targetAmount}
                onChange={handleInputChange('targetAmount')}
                placeholder="Ex: 1000000"
                min="0"
                step="0.01"
              />
              
              <Input
                label="Máximo de Cotas"
                type="number"
                value={formData.maxSupply}
                onChange={handleInputChange('maxSupply')}
                required
                placeholder="Ex: 10000"
                min="1"
              />
              
              <Input
                label="Preço por Cota (R$)"
                type="number"
                value={formData.price}
                onChange={handleInputChange('price')}
                required
                placeholder="Ex: 100.00"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          {/* Summary */}
          {formData.maxSupply && formData.price && (
            <div className="glass-card p-4">
              <h4 className="text-sm font-medium text-white mb-3">Resumo</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Valor Total:</span>
                  <span className="text-white ml-2">
                    R$ {(Number(formData.maxSupply) * Number(formData.price)).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Cotas Disponíveis:</span>
                  <span className="text-white ml-2">
                    {Number(formData.maxSupply).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.symbol || !formData.maxSupply || !formData.price}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Criar Fundo
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </GlassCard>
  );
};

export default CreateFundForm;