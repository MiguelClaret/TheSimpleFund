import React from 'react';
import { 
  ChartBarIcon, 
  CogIcon, 
  ClockIcon, 
  CheckIcon, 
  XMarkIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { GlassCard } from '../../common/Card';
import Button from '../../common/Button/Button';

interface Fund {
  id: string;
  name: string;
  symbol: string;
  description: string;
  targetAmount: number | null;
  maxSupply: number;
  totalIssued: number;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  consultorId?: string;
}

interface ConsultantFundListProps {
  funds: Fund[];
  loading?: boolean;
  onManageFund: (fund: Fund) => void;
}

const ConsultantFundList: React.FC<ConsultantFundListProps> = ({
  funds,
  loading = false,
  onManageFund
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckIcon className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XMarkIcon className="w-4 h-4 text-red-400" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-400" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      case 'pending':
        return 'Aguardando Aprovação';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <GlassCard>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Meus Fundos</h3>
          <div className="text-sm text-gray-400">
            {funds.length} {funds.length === 1 ? 'fundo' : 'fundos'}
          </div>
        </div>

        {/* Warning about approval */}
        <div className="glass-card p-4 border border-yellow-400/30">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-300">
              <p className="font-medium">Processo de Aprovação</p>
              <p className="text-yellow-200 mt-1">
                Fundos criados precisam ser aprovados pelo gestor antes de ficarem disponíveis para investimento.
              </p>
            </div>
          </div>
        </div>
        
        {funds.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mb-4">
              <ChartBarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nenhum fundo encontrado</h3>
            <p className="text-gray-400 mb-4">Comece criando seu primeiro fundo!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {funds.map((fund) => {
              const soldPercentage = fund.maxSupply > 0 ? (fund.totalIssued / fund.maxSupply) * 100 : 0;
              const availableShares = fund.maxSupply - fund.totalIssued;
              
              return (
                <div key={fund.id} className="glass-card p-6 hover:scale-[1.01] transition-transform">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(fund.status)}
                          <h4 className="text-lg font-medium text-white">{fund.name}</h4>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(fund.status)}`}>
                            {getStatusText(fund.status)}
                          </span>
                        </div>
                        
                        {fund.description && (
                          <p className="text-sm text-gray-300 mb-3">{fund.description}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Fund Statistics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="glass-card p-3">
                        <div className="text-xs text-gray-400 mb-1">Símbolo</div>
                        <div className="text-sm font-semibold text-white">{fund.symbol}</div>
                      </div>
                      
                      <div className="glass-card p-3">
                        <div className="text-xs text-gray-400 mb-1">Preço por Cota</div>
                        <div className="text-sm font-semibold text-green-400">
                          R$ {fund.price.toLocaleString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="glass-card p-3">
                        <div className="text-xs text-gray-400 mb-1">Meta</div>
                        <div className="text-sm font-semibold text-white">
                          R$ {fund.targetAmount?.toLocaleString('pt-BR') || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="glass-card p-3">
                        <div className="text-xs text-gray-400 mb-1">Disponíveis</div>
                        <div className="text-sm font-semibold text-white">
                          {availableShares.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    
                    {/* Emission Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Cotas Emitidas</span>
                        <span className="text-white">
                          {fund.totalIssued.toLocaleString('pt-BR')} / {fund.maxSupply.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                        />
                      </div>
                      
                      <div className="text-xs text-gray-400 text-center">
                        {soldPercentage.toFixed(1)}% emitido
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="text-xs text-gray-400">
                        Criado em {new Date(fund.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      
                      <Button
                        variant="secondary"
                        onClick={() => onManageFund(fund)}
                        className="bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                      >
                        <CogIcon className="w-4 h-4 mr-1" />
                        Gerenciar Cedentes/Sacados
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default ConsultantFundList;