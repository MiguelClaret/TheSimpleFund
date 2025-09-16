import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '../../common/Card';
import Button from '../../common/Button/Button';

interface Fund {
  id: string;
  name: string;
  symbol: string;
  description: string | null;
  price: number;
  totalIssued: number;
  maxSupply: number;
  targetAmount: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  consultorId?: string;
}

interface SimpleFundListProps {
  funds: Fund[];
  loading?: boolean;
  onInvest: (fund: Fund) => void;
  stellarKeysConfigured: boolean;
}

const SimpleFundList: React.FC<SimpleFundListProps> = ({
  funds,
  loading = false,
  onInvest,
  stellarKeysConfigured
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFunds = funds.filter(fund => 
    fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Fundos Disponíveis</h3>
      
      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou símbolo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
        />
      </div>

      {/* Funds Grid */}
      {filteredFunds.length === 0 ? (
        <GlassCard>
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {searchTerm ? 'Nenhum fundo encontrado' : 'Nenhum fundo disponível'}
            </h3>
            <p className="text-gray-400">
              {searchTerm 
                ? 'Tente buscar por outros termos.' 
                : 'Não há fundos aprovados para investimento no momento.'
              }
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFunds.map((fund) => {
            const availableShares = fund.maxSupply - fund.totalIssued;
            const soldPercentage = (fund.totalIssued / fund.maxSupply) * 100;
            
            return (
              <GlassCard key={fund.id} className="hover:scale-[1.02] transition-transform">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-white">{fund.name}</h4>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
                      Aprovado
                    </span>
                  </div>
                  
                  {fund.description && (
                    <p className="text-sm text-gray-300">{fund.description}</p>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Símbolo:</span>
                      <span className="text-white font-medium">{fund.symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Preço por cota:</span>
                      <span className="text-green-400 font-medium">R$ {fund.price.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Meta:</span>
                      <span className="text-white font-medium">R$ {fund.targetAmount?.toLocaleString('pt-BR') || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Cotas disponíveis:</span>
                      <span className="text-white font-medium">{availableShares.toLocaleString('pt-BR')}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 text-center">
                        {soldPercentage.toFixed(1)}% vendido
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => onInvest(fund)}
                    disabled={!stellarKeysConfigured || availableShares === 0}
                    variant="primary"
                    className="w-full"
                  >
                    {availableShares === 0 ? 'Esgotado' : 'Investir'}
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SimpleFundList;