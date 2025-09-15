import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { cedenteService, sacadoService, fundService, stellarService } from '../services/api';
import toast from 'react-hot-toast';

interface Cedente {
  id: number;
  name: string;
  email: string;
  cnpj: string;
  status: string;
  createdAt: string;
}

interface Sacado {
  id: number;
  name: string;
  email: string;
  cnpj: string;
  status: string;
  createdAt: string;
}

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
}

const GestorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'approval' | 'funds' | 'receivables'>('approval');
  const [pendingItems, setPendingItems] = useState<(Cedente | Sacado)[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFundForm, setShowFundForm] = useState(false);
  const [fundFormData, setFundFormData] = useState({
    name: '',
    description: '',
    symbol: '',
    maxSupply: '10000'
  });

  const loadPendingApprovals = useCallback(async () => {
    setLoading(true);
    try {
      const [cedentesResponse, sacadosResponse] = await Promise.all([
        cedenteService.list(),
        sacadoService.list()
      ]);
      
      const pendingCedentes = cedentesResponse.filter((c: Cedente) => c.status === 'pending');
      const pendingSacados = sacadosResponse.filter((s: Sacado) => s.status === 'pending');
      
      setPendingItems([...pendingCedentes, ...pendingSacados]);
    } catch {
      toast.error('Erro ao carregar aprovações pendentes');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFunds = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fundService.list();
      setFunds(response);
    } catch {
      toast.error('Erro ao carregar fundos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (activeTab === 'approval') {
      await loadPendingApprovals();
    } else {
      await loadFunds();
    }
  }, [activeTab, loadPendingApprovals, loadFunds]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApproval = async (id: number, status: 'approved' | 'rejected', type: 'cedente' | 'sacado') => {
    try {
      if (type === 'cedente') {
        await cedenteService.updateStatus(id.toString(), status);
      } else {
        await sacadoService.updateStatus(id.toString(), status);
      }
      toast.success(`${type === 'cedente' ? 'Cedente' : 'Sacado'} ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadPendingApprovals();
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleFundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create fund in database
      await fundService.create({
        name: fundFormData.name,
        symbol: fundFormData.symbol,
        maxSupply: parseInt(fundFormData.maxSupply),
        price: 100 // Default price
      });
      
      // Generate admin keys for this fund
      const keys = await stellarService.generateKeys();
      
      // Fund the admin account
      await stellarService.fundAccount(keys.publicKey);
      
      // Deploy fund token contract
      const tokenContract = await stellarService.deployContract(keys.secretKey, 'fund-token');
      
      // Deploy receivable vault contract
      await stellarService.deployContract(keys.secretKey, 'receivable-vault');
      
      // Initialize the fund token
      await stellarService.initializeFundToken(
        keys.secretKey,
        tokenContract.contractId,
        fundFormData.symbol,
        100000 // Initial supply
      );
      
      toast.success(`Fundo criado e tokenizado com sucesso! Token: ${tokenContract.contractId}`);
      setFundFormData({ name: '', description: '', symbol: '', maxSupply: '10000' });
      setShowFundForm(false);
      loadFunds();
    } catch {
      toast.error('Erro ao criar fundo');
    } finally {
      setLoading(false);
    }
  };

  const handleFundFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFundFormData({
      ...fundFormData,
      [e.target.name]: e.target.value
    });
  };

  const isItemCedente = (item: Cedente | Sacado): item is Cedente => {
    return 'cnpj' in item;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VERO Platform</h1>
              <p className="text-sm text-gray-500">Gestor Dashboard</p>
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
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('approval')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approval'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Aprovações Pendentes
            </button>
            <button
              onClick={() => setActiveTab('funds')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'funds'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Fundos
            </button>
            <button
              onClick={() => setActiveTab('receivables')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'receivables'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recebíveis
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'approval' ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Aprovações Pendentes</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CNPJ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingItems.map((item) => (
                        <tr key={`${isItemCedente(item) ? 'cedente' : 'sacado'}-${item.id}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {isItemCedente(item) ? 'Cedente' : 'Sacado'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.cnpj}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleApproval(item.id, 'approved', isItemCedente(item) ? 'cedente' : 'sacado')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleApproval(item.id, 'rejected', isItemCedente(item) ? 'cedente' : 'sacado')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Rejeitar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pendingItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhuma aprovação pendente
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'receivables' ? (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Gestão de Recebíveis</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Demo: Fluxo de Pagamento</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Simule o recebimento de um pagamento e distribuição automática para os investidores.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={async () => {
                        toast('📝 Registrando recebível no blockchain...', { icon: '⏳' });
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        toast.success('✅ Recebível registrado com sucesso!');
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      1. Registrar Recebível (R$ 50.000)
                    </button>
                    
                    <button
                      onClick={async () => {
                        toast('💰 Marcando recebível como pago...', { icon: '⏳' });
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        toast.success('✅ Pagamento confirmado!');
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      2. Marcar como Pago (R$ 50.000)
                    </button>
                    
                    <button
                      onClick={async () => {
                        toast('🔄 Distribuindo pagamentos proporcionalmente...', { icon: '⏳' });
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        toast.success('✅ Distribuição concluída!');
                        toast.success('💎 Investidores receberam tokens proporcionalmente!');
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      3. Distribuir para Investidores
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Histórico de Recebíveis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Recebível #001 - Empresa XYZ</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Pago: R$ 25.000
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Recebível #002 - Empresa ABC</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        Pendente: R$ 15.000
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Recebível #003 - Empresa DEF</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Registrado: R$ 30.000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Create Fund Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowFundForm(!showFundForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                {showFundForm ? 'Cancelar' : 'Criar Novo Fundo'}
              </button>
            </div>

            {/* Fund Form */}
            {showFundForm && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Criar Novo Fundo</h3>
                <form onSubmit={handleFundSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome do Fundo</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={fundFormData.name}
                      onChange={handleFundFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Símbolo do Token</label>
                    <input
                      type="text"
                      name="symbol"
                      required
                      value={fundFormData.symbol}
                      onChange={handleFundFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantidade Máxima de Tokens</label>
                    <input
                      type="number"
                      name="maxSupply"
                      required
                      value={fundFormData.maxSupply}
                      onChange={handleFundFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      value={fundFormData.description}
                      onChange={handleFundFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Criando...' : 'Criar Fundo'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Funds List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium mb-4">Fundos Criados</h3>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {funds.map((fund) => (
                      <div key={fund.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{fund.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{fund.description || 'Sem descrição'}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Símbolo: {fund.symbol}</span>
                          <span className="text-blue-600 font-medium">
                            R$ {fund.targetAmount ? fund.targetAmount.toLocaleString('pt-BR') : 'N/A'}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            fund.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : fund.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {fund.status === 'active' ? 'Ativo' : 
                             fund.status === 'pending' ? 'Pendente' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {funds.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum fundo criado
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestorDashboard;