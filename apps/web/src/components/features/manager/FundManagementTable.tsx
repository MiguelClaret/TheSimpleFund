import React from 'react';
import { 
  CheckIcon, 
  XMarkIcon, 
  ClockIcon, 
  ChartBarIcon,
  CurrencyDollarIcon,
  StopIcon 
} from '@heroicons/react/24/outline';
import { GlassCard } from '../../common/Card';
import Button from '../../common/Button/Button';

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
  consultor?: {
    email: string;
  };
}

interface FundManagementTableProps {
  funds: Fund[];
  loading?: boolean;
  onApprove: (id: string, action: 'approve' | 'reject') => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
}

const FundManagementTable: React.FC<FundManagementTableProps> = ({
  funds,
  loading = false,
  onApprove,
  onDeactivate
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckIcon className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XMarkIcon className="w-4 h-4 text-red-400" />;
      case 'inactive':
        return <StopIcon className="w-4 h-4 text-gray-400" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      case 'pending':
        return 'Pendente';
      case 'inactive':
        return 'Inativo';
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
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
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
        <h3 className="text-lg font-medium text-white">Gerenciamento de Fundos</h3>
        
        {funds.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mb-4">
              <ChartBarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nenhum fundo encontrado</h3>
            <p className="text-gray-400">Não há fundos cadastrados no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {funds.map((fund) => {
              const soldPercentage = (fund.totalIssued / fund.maxSupply) * 100;
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
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="text-gray-400">Símbolo</div>
                            <div className="text-white font-medium">{fund.symbol}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-400">Preço por cota</div>
                            <div className="text-green-400 font-medium">R$ {fund.price.toLocaleString('pt-BR')}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-400">Meta</div>
                            <div className="text-white font-medium">
                              R$ {fund.targetAmount?.toLocaleString('pt-BR') || 'N/A'}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-400">Consultor</div>
                            <div className="text-blue-400 font-medium text-xs">
                              {fund.consultor?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress and Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="glass-card p-3">
                        <div className="flex items-center space-x-2">
                          <ChartBarIcon className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-gray-400">Cotas Emitidas</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {fund.totalIssued.toLocaleString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="glass-card p-3">
                        <div className="flex items-center space-x-2">
                          <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-gray-400">Disponíveis</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {availableShares.toLocaleString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="glass-card p-3">
                        <div className="flex items-center space-x-2">
                          <ChartBarIcon className="w-4 h-4 text-purple-400" />
                          <span className="text-xs text-gray-400">% Vendido</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {soldPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-gray-400">
                        Criado em {new Date(fund.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      
                      <div className="flex space-x-2">
                        {fund.status.toLowerCase() === 'pending' && (
                          <>
                            <Button
                              variant="secondary"
                              onClick={() => onApprove(fund.id, 'approve')}
                              className="bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30"
                            >
                              <CheckIcon className="w-4 h-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => onApprove(fund.id, 'reject')}
                              className="bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
                            >
                              <XMarkIcon className="w-4 h-4 mr-1" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                        
                        {fund.status.toLowerCase() === 'approved' && (
                          <Button
                            variant="secondary"
                            onClick={() => onDeactivate(fund.id)}
                            className="bg-gray-500/20 border-gray-400/30 text-gray-300 hover:bg-gray-500/30"
                          >
                            <StopIcon className="w-4 h-4 mr-1" />
                            Desativar
                          </Button>
                        )}
                      </div>
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

export default FundManagementTable;