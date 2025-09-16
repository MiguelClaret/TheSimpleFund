import React, { useState } from 'react';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { orderService } from '../../../services/api';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';

interface Fund {
  id: string;
  name: string;
  description: string | null;
  targetAmount: number | null;
  symbol: string;
  status: string;
  maxSupply: number;
  totalIssued: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  consultorId?: string;
}

interface InvestmentModalProps {
  fund: Fund | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  stellarKeys: { publicKey: string; secretKey: string } | null;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({
  fund,
  isOpen,
  onClose,
  onSuccess,
  stellarKeys
}) => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !fund) return null;

  const availableShares = fund.maxSupply - fund.totalIssued;
  const maxInvestment = availableShares * fund.price;
  const sharesWillReceive = investmentAmount ? Math.floor(parseFloat(investmentAmount) / fund.price) : 0;

  const handleInvestment = async () => {
    if (!fund || !investmentAmount) {
      toast.error('Selecione um fundo e valor de investimento');
      return;
    }

    if (!stellarKeys) {
      toast.error('Gere as chaves Stellar primeiro');
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (amount < fund.price) {
      toast.error(`Valor mínimo é R$ ${fund.price.toLocaleString('pt-BR')}`);
      return;
    }

    if (amount > maxInvestment) {
      toast.error(`Valor máximo disponível é R$ ${maxInvestment.toLocaleString('pt-BR')}`);
      return;
    }

    setLoading(true);
    try {
      // Create order in database
      await orderService.create({
        fundId: fund.id,
        amount,
        quantity: sharesWillReceive
      });
      
      // For demo: Mock the blockchain operations
      // In production, these would be real Soroban contract calls
      
      // 1. Add investor to whitelist (mock)
      toast('Adicionando investidor à whitelist...', { icon: 'ℹ️' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 2. Mint tokens to investor (mock)
      toast('Mintando tokens para o investidor...', { icon: '🪙' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 3. Update token balance (mock)
      toast('Atualizando saldo de tokens...', { icon: '📊' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Investimento de R$ ${amount.toLocaleString('pt-BR')} realizado com sucesso!`);
      toast.success(`Você recebeu ${sharesWillReceive} tokens ${fund.symbol || 'FUND'}!`);
      
      setInvestmentAmount('');
      onSuccess();
      onClose();
    } catch {
      toast.error('Erro ao criar ordem de investimento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative glass-card max-w-md w-full mx-auto animate-scale-up">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-white">
              Investir em {fund.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="glass-card p-4 mb-6">
            <h4 className="font-medium text-white mb-3">Informações do Fundo</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Símbolo:</span>
                <span className="font-medium text-white">{fund.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Preço por cota:</span>
                <span className="font-medium text-green-400">R$ {fund.price.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cotas disponíveis:</span>
                <span className="font-medium text-white">{availableShares.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Meta do fundo:</span>
                <span className="font-medium text-white">R$ {fund.targetAmount?.toLocaleString('pt-BR') || 'N/A'}</span>
              </div>
            </div>
            {fund.description && (
              <p className="text-sm text-gray-300 mt-3 pt-3 border-t border-white/10">
                {fund.description}
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <Input
              label="Valor do Investimento (R$)"
              type="number"
              step="0.01"
              min={fund.price}
              max={maxInvestment}
              value={investmentAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInvestmentAmount(e.target.value)}
              placeholder={`Mínimo: R$ ${fund.price.toLocaleString('pt-BR')}`}
            />
            {investmentAmount && sharesWillReceive > 0 && (
              <p className="text-sm text-gray-300 mt-2">
                Você receberá: {sharesWillReceive} cotas
              </p>
            )}
          </div>

          <div className="mb-6 glass-card p-4 border border-blue-400/30">
            <div className="flex">
              <InformationCircleIcon className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-2">Importante:</p>
                <ul className="space-y-1">
                  <li>• Este é um fundo aprovado para investimento</li>
                  <li>• O valor mínimo é R$ {fund.price.toLocaleString('pt-BR')} (1 cota)</li>
                  <li>• Tokens serão depositados na sua carteira Stellar</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={handleInvestment}
              disabled={loading || !investmentAmount || parseFloat(investmentAmount || '0') < fund.price}
              className="flex-1"
              loading={loading}
            >
              {loading ? 'Investindo...' : 'Confirmar Investimento'}
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;