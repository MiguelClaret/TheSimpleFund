import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fundService, orderService, stellarService } from '../services/api';
import toast from 'react-hot-toast';

interface Fund {
  id: number;
  name: string;
  description: string;
  targetAmount: number;
  tokenSymbol: string;
  status: string;
  createdAt: string;
}

interface Order {
  id: number;
  fundId: number;
  amount: number;
  quantity: number;
  status: string;
  createdAt: string;
  fund?: Fund;
}

const InvestidorDashboard: React.FC = () => {
  const { user, logout, updateStellarKey } = useAuth();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'portfolio'>('marketplace');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [stellarKeys, setStellarKeys] = useState<{publicKey: string, secretKey: string} | null>(null);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [tokenBalances, setTokenBalances] = useState<{[symbol: string]: number}>({});

  const loadFunds = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fundService.list();
      setFunds(response.filter((fund: Fund) => fund.status === 'active'));
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

  const generateStellarKeys = async () => {
    try {
      const response = await stellarService.generateKeys();
      setStellarKeys(response);
      await updateStellarKey(response.publicKey, response.secretKey);
      toast.success('Chaves Stellar geradas com sucesso!');
    } catch {
      toast.error('Erro ao gerar chaves Stellar');
    }
  };

  const fundAccount = async () => {
    if (!stellarKeys) {
      toast.error('Gere as chaves Stellar primeiro');
      return;
    }

    try {
      await stellarService.fundAccount(stellarKeys.publicKey);
      toast.success('Conta financiada com XLM de teste!');
    } catch {
      toast.error('Erro ao financiar conta');
    }
  };

  const handleInvestment = async () => {
    if (!selectedFund || !investmentAmount) {
      toast.error('Selecione um fundo e valor de investimento');
      return;
    }

    if (!stellarKeys) {
      toast.error('Gere as chaves Stellar primeiro');
      return;
    }

    setLoading(true);
    try {
      const amount = parseFloat(investmentAmount);
      
      // Create order in database
      await orderService.create({
        fundId: selectedFund.id,
        amount,
        quantity: amount // Simplificado: 1 token = 1 real
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
      toast.success(`Você recebeu ${amount} tokens ${selectedFund.tokenSymbol || 'FUND'}!`);
      
      setSelectedFund(null);
      setInvestmentAmount('');
      loadOrders();
    } catch {
      toast.error('Erro ao criar ordem de investimento');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VERO Platform</h1>
              <p className="text-sm text-gray-500">Investidor Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {user?.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stellar Setup */}
        {!stellarKeys && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">Configurar Carteira Stellar</h3>
                <p className="text-sm text-blue-700">
                  Para investir em fundos tokenizados, você precisa de uma carteira Stellar.
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={generateStellarKeys}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Gerar Carteira
                </button>
              </div>
            </div>
          </div>
        )}

        {stellarKeys && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-green-900">Carteira Stellar Configurada</h3>
                <p className="text-sm text-green-700 font-mono">{stellarKeys.publicKey}</p>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-green-800">Saldos de Tokens:</h4>
                  <div className="flex space-x-4 mt-1">
                    {Object.entries(tokenBalances).length > 0 ? (
                      Object.entries(tokenBalances).map(([symbol, balance]) => (
                        <span key={symbol} className="text-sm text-green-700">
                          {symbol}: {balance}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-green-600">Nenhum token encontrado</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={fundAccount}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Financiar (Testnet)
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'marketplace'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'portfolio'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meu Portfólio
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'marketplace' ? (
          <div>
            <h3 className="text-lg font-medium mb-4">Fundos Disponíveis</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {funds.map((fund) => (
                  <div key={fund.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{fund.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{fund.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">Símbolo: {fund.tokenSymbol}</span>
                      <span className="text-lg font-bold text-blue-600">
                        R$ {fund.targetAmount.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedFund(fund)}
                      disabled={!stellarKeys}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Investir
                    </button>
                  </div>
                ))}
              </div>
            )}
            {funds.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                Nenhum fundo disponível para investimento
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-4">Meus Investimentos</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fundo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Investido
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tokens
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Fundo #{order.fundId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {order.amount.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum investimento realizado
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Investment Modal */}
      {selectedFund && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Investir em {selectedFund.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{selectedFund.description}</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Investimento (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="1000.00"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleInvestment}
                  disabled={loading || !investmentAmount}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Investindo...' : 'Confirmar Investimento'}
                </button>
                <button
                  onClick={() => {
                    setSelectedFund(null);
                    setInvestmentAmount('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestidorDashboard;