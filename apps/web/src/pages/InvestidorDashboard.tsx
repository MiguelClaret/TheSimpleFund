import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fundService, orderService, stellarService } from '../services/api';
import toast from 'react-hot-toast';

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
  const { user, logout, updateStellarKey, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'portfolio'>('marketplace');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [stellarKeys, setStellarKeys] = useState<{publicKey: string, secretKey: string} | null>(null);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

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
      toast.success(`Você recebeu ${amount} tokens ${selectedFund.symbol || 'FUND'}!`);
      
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
      {/* Modal de Aguardando Aprovação */}
      {user?.status !== 'APPROVED' && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aguardando Aprovação
              </h3>
              <div className="text-sm text-gray-600 mb-6">
                <p className="mb-3">
                  Sua conta de investidor está sendo analisada pela equipe de gestão. 
                  Aguarde a aprovação para acessar todas as funcionalidades da plataforma.
                </p>
                <div className="bg-yellow-50 rounded-lg p-3 text-left">
                  <h4 className="font-medium text-yellow-800 mb-2">Status atual:</h4>
                  <div className="flex items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      user?.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user?.status === 'PENDING' ? 'Pendente de Aprovação' :
                       user?.status === 'REJECTED' ? 'Reprovado' :
                       user?.status || 'Em Análise'}
                    </span>
                  </div>
                </div>
                {user?.status === 'REJECTED' && (
                  <div className="bg-red-50 rounded-lg p-3 text-left mt-3">
                    <p className="text-red-800 text-sm">
                      <strong>Acesso Negado:</strong> Sua conta foi reprovada. 
                      Entre em contato com o suporte para mais informações.
                    </p>
                  </div>
                )}
                <p className="mt-3 text-xs">
                  📧 Em caso de dúvidas, entre em contato: suporte@vero.com.br
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    try {
                      await refreshUser();
                      toast.success('Status atualizado!');
                    } catch (error) {
                      toast.error('Erro ao atualizar status');
                    }
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Atualizar Status
                </button>
                <button
                  onClick={logout}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content - Only shown if approved */}
      {user?.status === 'APPROVED' && (
        <>
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
        {/* Investor Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-blue-900">Bem-vindo à Área do Investidor</h3>
              <div className="mt-2 text-sm text-blue-800">
                <p className="mb-2">Como investidor, você tem acesso a:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Marketplace:</strong> Fundos aprovados e disponíveis para investimento</li>
                  <li><strong>Portfólio:</strong> Seus investimentos e histórico de transações</li>
                  <li><strong>Segurança:</strong> Apenas fundos aprovados pelo gestor são exibidos</li>
                </ul>
                <p className="mt-3 text-xs text-blue-600">
                  💡 Todos os investimentos são processados via blockchain Stellar para máxima transparência e segurança.
                </p>
              </div>
            </div>
          </div>
        </div>

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
                {/* TODO: Implementar carregamento de saldos de tokens
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-green-800">Saldos de Tokens:</h4>
                  <div className="flex space-x-4 mt-1">
                    <span className="text-sm text-green-600">Funcionalidade em desenvolvimento</span>
                  </div>
                </div>
                */}
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
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{fund.name}</h4>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Aprovado
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{fund.description || 'Sem descrição'}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Símbolo:</span>
                        <span className="text-sm font-medium">{fund.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Preço por cota:</span>
                        <span className="text-sm font-medium text-green-600">R$ {fund.price.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Meta:</span>
                        <span className="text-sm font-medium">R$ {fund.targetAmount?.toLocaleString('pt-BR') || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Cotas disponíveis:</span>
                        <span className="text-sm font-medium">{(fund.maxSupply - fund.totalIssued).toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((fund.totalIssued / fund.maxSupply) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        {((fund.totalIssued / fund.maxSupply) * 100).toFixed(1)}% vendido
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedFund(fund)}
                      disabled={!stellarKeys || (fund.maxSupply - fund.totalIssued) === 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {(fund.maxSupply - fund.totalIssued) === 0 ? 'Esgotado' : 'Investir'}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {funds.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum fundo disponível</h3>
                <p className="text-gray-500">
                  Não há fundos aprovados para investimento no momento. 
                  <br />
                  Novos fundos estarão disponíveis após aprovação do gestor.
                </p>
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
                          {order.fund?.name || `Fundo #${order.fundId}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {order.total?.toLocaleString('pt-BR') || 'N/A'}
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
          <div className="relative top-10 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Investir em {selectedFund.name}
                </h3>
                <button
                  onClick={() => {
                    setSelectedFund(null);
                    setInvestmentAmount('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Informações do Fundo</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Símbolo:</span>
                    <span className="font-medium">{selectedFund.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preço por cota:</span>
                    <span className="font-medium text-green-600">R$ {selectedFund.price.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cotas disponíveis:</span>
                    <span className="font-medium">{(selectedFund.maxSupply - selectedFund.totalIssued).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meta do fundo:</span>
                    <span className="font-medium">R$ {selectedFund.targetAmount?.toLocaleString('pt-BR') || 'N/A'}</span>
                  </div>
                </div>
                {selectedFund.description && (
                  <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">{selectedFund.description}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Investimento (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={selectedFund.price}
                  max={(selectedFund.maxSupply - selectedFund.totalIssued) * selectedFund.price}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={`Mínimo: R$ ${selectedFund.price.toLocaleString('pt-BR')}`}
                />
                {investmentAmount && (
                  <p className="text-sm text-gray-500 mt-1">
                    Você receberá: {Math.floor(parseFloat(investmentAmount) / selectedFund.price)} cotas
                  </p>
                )}
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Importante:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Este é um fundo aprovado para investimento</li>
                      <li>O valor mínimo é R$ {selectedFund.price.toLocaleString('pt-BR')} (1 cota)</li>
                      <li>Tokens serão depositados na sua carteira Stellar</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleInvestment}
                  disabled={loading || !investmentAmount || parseFloat(investmentAmount) < selectedFund.price}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Investindo...' : 'Confirmar Investimento'}
                </button>
                <button
                  onClick={() => {
                    setSelectedFund(null);
                    setInvestmentAmount('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default InvestidorDashboard;