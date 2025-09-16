import React, { useState, useEffect, useCallback } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/useAuth';
import { fundService, orderService } from '../services/api';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import {
  AccessDeniedModal,
  InvestmentModal,
  StellarWalletCard
} from '../components/features/investor';
import SimplePortfolioCard from '../components/features/investor/SimplePortfolioCard';
import SimpleFundList from '../components/features/investor/SimpleFundList';
import { GlassCard } from '../components/common/Card';

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

interface Order {
  id: string;
  fundId: string;
  total: number;
  price: number;
  quantity: number;
  status: string;
  txHash?: string;
  createdAt: string;
  updatedAt: string;
  fund?: {
    name: string;
    symbol: string;
  };
}

const InvestidorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'portfolio'>('marketplace');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [stellarKeys, setStellarKeys] = useState<{publicKey: string, secretKey: string} | null>(null);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);

  const loadFunds = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fundService.list();
      // Investidores veem apenas fundos aprovados
      setFunds(response.filter((fund: Fund) => fund.status === 'APPROVED'));
    } catch {
      toast.error('Erro ao carregar fundos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.list();
      setOrders(response);
    } catch {
      toast.error('Erro ao carregar portfólio');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (activeTab === 'marketplace') {
      await loadFunds();
    } else {
      await loadOrders();
    }
  }, [activeTab, loadFunds, loadOrders]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate portfolio stats
  const totalInvested = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const activeFunds = new Set(orders.map(order => order.fundId)).size;

  const handleInvestmentSuccess = () => {
    if (activeTab === 'portfolio') {
      loadOrders();
    } else {
      loadFunds();
    }
  };

  const handleSelectFund = (fund: Fund) => {
    setSelectedFund(fund);
  };

  return (
    <>
      <AccessDeniedModal isOpen={user?.status !== 'APPROVED'} />
      
      {user?.status === 'APPROVED' && (
        <DashboardLayout title="Dashboard do Investidor">
          {/* Welcome Section */}
          <GlassCard className="border border-blue-400/30 mb-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <InformationCircleIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Bem-vindo à Área do Investidor</h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>Como investidor, você tem acesso a:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    <li><strong className="text-white">Marketplace:</strong> Fundos aprovados e disponíveis para investimento</li>
                    <li><strong className="text-white">Portfólio:</strong> Seus investimentos e histórico de transações</li>
                    <li><strong className="text-white">Segurança:</strong> Apenas fundos aprovados pelo gestor são exibidos</li>
                  </ul>
                  <p className="text-xs text-blue-400 pt-2">
                    💡 Todos os investimentos são processados via blockchain Stellar para máxima transparência e segurança.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Stellar Wallet Setup */}
          <div className="mb-8">
            <StellarWalletCard
              stellarKeys={stellarKeys}
              onKeysGenerated={setStellarKeys}
            />
          </div>

          {/* Portfolio Summary */}
          {activeTab === 'portfolio' && (
            <div className="mb-8">
              <SimplePortfolioCard
                totalInvested={totalInvested}
                activeFunds={activeFunds}
                totalOrders={orders.length}
              />
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-white/20 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'marketplace'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'portfolio'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Meu Portfólio
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'marketplace' ? (
              <SimpleFundList
                funds={funds}
                loading={loading}
                onInvest={handleSelectFund}
                stellarKeysConfigured={!!stellarKeys}
              />
            ) : (
              <div>
                <h3 className="text-lg font-medium text-white mb-6">Histórico de Investimentos</h3>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  </div>
                ) : (
                  <GlassCard>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Fundo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Valor Investido
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Tokens
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Data
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                {order.fund?.name || `Fundo #${order.fundId}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                R$ {order.total?.toLocaleString('pt-BR') || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {order.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                  order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                  order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {order.status === 'completed' ? 'Concluída' :
                                   order.status === 'pending' ? 'Pendente' :
                                   order.status === 'cancelled' ? 'Cancelada' :
                                   order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {orders.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                          Nenhum investimento realizado
                        </div>
                      )}
                    </div>
                  </GlassCard>
                )}
              </div>
            )}
          </div>

          {/* Investment Modal */}
          <InvestmentModal
            fund={selectedFund}
            isOpen={!!selectedFund}
            onClose={() => setSelectedFund(null)}
            onSuccess={handleInvestmentSuccess}
            stellarKeys={stellarKeys}
          />
        </DashboardLayout>
      )}
    </>
  );
};

export default InvestidorDashboard;