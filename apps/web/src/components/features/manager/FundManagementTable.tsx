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
        return <CheckIcon className="w-4 h-4 text-green-300" />;
      case 'rejected':
        return <XMarkIcon className="w-4 h-4 text-red-300" />;
      case 'inactive':
        return <StopIcon className="w-4 h-4 text-gray-300" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-300" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500/30 text-green-300 border-green-400/40';
      case 'rejected':
        return 'bg-red-500/30 text-red-300 border-red-400/40';
      case 'inactive':
        return 'bg-gray-500/30 text-gray-300 border-gray-400/40';
      default:
        return 'bg-yellow-500/30 text-yellow-300 border-yellow-400/40';
    }
  };

  if (loading) {
    return (
      <GlassCard className="bg-white/10 backdrop-blur-xl border-white/20">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="bg-white/10 backdrop-blur-xl border-white/20">
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-white">Fund Management</h3>
        
        {funds.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-400/30 rounded-full flex items-center justify-center mb-4">
              <ChartBarIcon className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No funds found</h3>
            <p className="text-gray-200">No funds registered at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {funds.map((fund) => {
              const soldPercentage = (fund.totalIssued / fund.maxSupply) * 100;
              const availableShares = fund.maxSupply - fund.totalIssued;
              
              return (
                <div key={fund.id} className="bg-white/10 border border-white/20 rounded-lg p-6 hover:scale-[1.01] transition-transform backdrop-blur-sm">
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
                          <p className="text-sm text-gray-200 mb-3">{fund.description}</p>
                        )}
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="text-gray-300">Symbol</div>
                            <div className="text-white font-medium">{fund.symbol}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-300">Price per share</div>
                            <div className="text-green-300 font-medium">$ {fund.price.toLocaleString('en-US')}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-300">Target</div>
                            <div className="text-white font-medium">
                              $ {fund.targetAmount?.toLocaleString('en-US') || 'N/A'}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-300">Consultant</div>
                            <div className="text-blue-300 font-medium text-xs">
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
                      <div className="text-xs text-gray-300">
                        Created on {new Date(fund.createdAt).toLocaleDateString('en-US')}
                      </div>
                      
                      <div className="flex space-x-2">
                        {fund.status.toLowerCase() === 'pending' && (
                          <>
                            <Button
                              variant="secondary"
                              onClick={() => onApprove(fund.id, 'approve')}
                              className="bg-green-400/40 border-green-300/40 text-green-200 hover:bg-green-400/50 transition-all duration-200"
                            >
                              <CheckIcon className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => onApprove(fund.id, 'reject')}
                              className="bg-red-400/40 border-red-300/40 text-red-200 hover:bg-red-400/50 transition-all duration-200"
                            >
                              <XMarkIcon className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {fund.status.toLowerCase() === 'approved' && (
                          <Button
                            variant="secondary"
                            onClick={() => onDeactivate(fund.id)}
                            className="bg-gray-400/40 border-gray-300/40 text-gray-200 hover:bg-gray-400/50 transition-all duration-200"
                          >
                            <StopIcon className="w-4 h-4 mr-1" />
                            Deactivate
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