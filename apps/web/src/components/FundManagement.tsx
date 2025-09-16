import React, { useState, useEffect } from 'react';
import { cedenteService, sacadoService } from '../services/api';
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

interface Cedente {
  id: string;
  name: string;
  document: string;
  address?: string;
  publicKey?: string;
  status: string;
  createdAt: string;
  consultor?: {
    email: string;
    role: string;
  };
  fund?: {
    name: string;
    id: string;
  };
}

interface Sacado {
  id: string;
  name: string;
  document: string;
  address?: string;
  publicKey?: string;
  status: string;
  createdAt: string;
  consultor?: {
    email: string;
    role: string;
  };
  fund?: {
    name: string;
    id: string;
  };
}

interface FundManagementProps {
  fund: Fund;
  onBack: () => void;
}

const FundManagement: React.FC<FundManagementProps> = ({ fund, onBack }) => {
  const [activeTab, setActiveTab] = useState<'cedentes' | 'sacados'>('cedentes');
  const [cedentes, setCedentes] = useState<Cedente[]>([]);
  const [sacados, setSacados] = useState<Sacado[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    address: '',
    publicKey: ''
  });

  const loadCedentes = async () => {
    try {
      setLoading(true);
      const data = await cedenteService.listByFund(fund.id);
      setCedentes(data);
    } catch (error) {
      toast.error('Erro ao carregar cedentes');
    } finally {
      setLoading(false);
    }
  };

  const loadSacados = async () => {
    try {
      setLoading(true);
      const data = await sacadoService.listByFund(fund.id);
      setSacados(data);
    } catch (error) {
      toast.error('Erro ao carregar sacados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'cedentes') {
      loadCedentes();
    } else {
      loadSacados();
    }
  }, [activeTab, fund.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        fundId: fund.id
      };

      if (activeTab === 'cedentes') {
        await cedenteService.create(data);
        toast.success('Cedente cadastrado com sucesso!');
        loadCedentes();
      } else {
        await sacadoService.create(data);
        toast.success('Sacado cadastrado com sucesso!');
        loadSacados();
      }

      setFormData({ name: '', document: '', address: '', publicKey: '' });
      setShowForm(false);
    } catch (error) {
      toast.error('Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const renderTable = () => {
    const data = activeTab === 'cedentes' ? cedentes : sacados;
    const title = activeTab === 'cedentes' ? 'Cedentes' : 'Sacados';

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title} do Fundo: {fund.name}</h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Adicionar {activeTab === 'cedentes' ? 'Cedente' : 'Sacado'}
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.document}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'APPROVED' 
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              Nenhum {activeTab === 'cedentes' ? 'cedente' : 'sacado'} cadastrado neste fundo
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (!showForm) return null;

    const title = activeTab === 'cedentes' ? 'Novo Cedente' : 'Novo Sacado';

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Documento (CNPJ/CPF)</label>
              <input
                type="text"
                name="document"
                value={formData.document}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Chave Pública Stellar</label>
              <input
                type="text"
                name="publicKey"
                value={formData.publicKey}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header with fund info and back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Fundo: {fund.name}</h2>
            <p className="text-sm text-gray-600">Código: {fund.symbol} | Status: {fund.status}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {(['cedentes', 'sacados'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        renderTable()
      )}

      {/* Form Modal */}
      {renderForm()}
    </div>
  );
};

export default FundManagement;