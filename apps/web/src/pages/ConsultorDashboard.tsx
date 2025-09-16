import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { cedenteService, sacadoService, fundService } from '../services/api';
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
  consultorId?: string;
}

const ConsultorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'fundos' | 'cedentes' | 'sacados'>('fundos');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [cedentes, setCedentes] = useState<Cedente[]>([]);
  const [sacados, setSacados] = useState<Sacado[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    symbol: '',
    maxSupply: '10000',
    email: '',
    cnpj: '',
    phone: '',
    address: ''
  });

  const loadFunds = useCallback(async () => {
    setLoading(true);
    try {
      // Filter only funds created by this consultor
      const response = await fundService.list();
      const myFunds = response.filter((fund: Fund) => fund.consultorId === user?.id);
      setFunds(myFunds);
    } catch {
      toast.error('Erro ao carregar fundos');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadCedentes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cedenteService.list();
      setCedentes(response);
    } catch {
      toast.error('Erro ao carregar cedentes');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSacados = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sacadoService.list();
      setSacados(response);
    } catch {
      toast.error('Erro ao carregar sacados');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    switch (activeTab) {
      case 'fundos':
        await loadFunds();
        break;
      case 'cedentes':
        await loadCedentes();
        break;
      case 'sacados':
        await loadSacados();
        break;
    }
  }, [activeTab, loadFunds, loadCedentes, loadSacados]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'fundos') {
        // Criar fundo
        const fundData = {
          name: formData.name,
          description: formData.description,
          symbol: formData.symbol,
          maxSupply: parseInt(formData.maxSupply, 10),
          targetAmount: parseInt(formData.maxSupply, 10) * 100, // Valor default baseado na oferta
          price: 100 // Preço padrão de R$ 100 por cota
        };
        await fundService.create(fundData);
        toast.success('Fundo criado com sucesso! Aguardando aprovação do gestor.');
      } else if (activeTab === 'cedentes') {
        await cedenteService.create(formData);
        toast.success('Cedente cadastrado com sucesso!');
      } else {
        await sacadoService.create(formData);
        toast.success('Sacado cadastrado com sucesso!');
      }
      setFormData({ 
        name: '', 
        description: '',
        symbol: '',
        maxSupply: '10000',
        email: '', 
        cnpj: '', 
        phone: '', 
        address: '' 
      });
      setShowForm(false);
      loadData();
    } catch {
      toast.error('Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VERO Platform</h1>
              <p className="text-sm text-gray-500">Consultor Dashboard</p>
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
              onClick={() => setActiveTab('fundos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fundos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meus Fundos
            </button>
            <button
              onClick={() => setActiveTab('cedentes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cedentes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cedentes
            </button>
            <button
              onClick={() => setActiveTab('sacados')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sacados'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sacados
            </button>
          </nav>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            {showForm ? 'Cancelar' : 
             activeTab === 'fundos' ? 'Criar Fundo' :
             activeTab === 'cedentes' ? 'Cadastrar Cedente' : 'Cadastrar Sacado'}
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">
              {activeTab === 'fundos' ? 'Criar Novo Fundo' :
               activeTab === 'cedentes' ? 'Cadastrar Cedente' : 'Cadastrar Sacado'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {activeTab === 'fundos' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome do Fundo</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Símbolo</label>
                    <input
                      type="text"
                      name="symbol"
                      required
                      value={formData.symbol}
                      onChange={handleChange}
                      placeholder="Ex: FUND01"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Oferta Máxima (cotas)</label>
                    <input
                      type="number"
                      name="maxSupply"
                      required
                      value={formData.maxSupply}
                      onChange={handleChange}
                      min="1"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                    <input
                      type="text"
                      name="cnpj"
                      required
                      value={formData.cnpj}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </>
              )}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Cadastrando...' : 
                   activeTab === 'fundos' ? 'Criar Fundo' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content Section */}
        {activeTab === 'fundos' ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Meus Fundos</h3>
              <p className="text-sm text-amber-600 mb-4">
                ⚠️ Fundos criados precisam ser aprovados pelo gestor antes de ficarem disponíveis para investimento.
              </p>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {funds.map((fund) => (
                    <div key={fund.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{fund.name}</h4>
                          <p className="text-sm text-gray-600">{fund.description}</p>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Símbolo:</span> {fund.symbol}
                            </div>
                            <div>
                              <span className="text-gray-500">Meta:</span> R$ {fund.targetAmount?.toLocaleString('pt-BR') || 'N/A'}
                            </div>
                            <div>
                              <span className="text-gray-500">Oferta Máxima:</span> {fund.maxSupply.toLocaleString('pt-BR')} cotas
                            </div>
                            <div>
                              <span className="text-gray-500">Preço:</span> R$ {fund.price.toLocaleString('pt-BR')}
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                            fund.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            fund.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            fund.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {fund.status === 'PENDING' ? 'Aguardando Aprovação' :
                             fund.status === 'APPROVED' ? 'Aprovado' :
                             fund.status === 'REJECTED' ? 'Rejeitado' : fund.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {funds.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum fundo criado. Comece criando seu primeiro fundo!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* List Section for Cedentes and Sacados */
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium mb-4">
                {activeTab === 'cedentes' ? 'Cedentes Cadastrados' : 'Sacados Cadastrados'}
              </h3>
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
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CNPJ
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
                      {(activeTab === 'cedentes' ? cedentes : sacados).map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.cnpj}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : item.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.status === 'approved' ? 'Aprovado' : 
                               item.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(activeTab === 'cedentes' ? cedentes : sacados).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum {activeTab === 'cedentes' ? 'cedente' : 'sacado'} cadastrado
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultorDashboard;