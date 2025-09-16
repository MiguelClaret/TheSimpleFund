import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { cedenteService, sacadoService, fundService } from '../services/api';
import toast from 'react-hot-toast';

interface Cedente {
  id: number;
  name: string;
  document?: string;
  cnpj?: string;
  status: string;
  createdAt: string;
  consultor?: {
    email: string;
  };
}

interface Sacado {
  id: number;
  name: string;
  document?: string;
  cnpj?: string;
  status: string;
  createdAt: string;
  consultor?: {
    email: string;
  };
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
  consultor?: {
    email: string;
  };
}

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const GestorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'consultores' | 'fundos' | 'cedentes' | 'sacados'>('consultores');
  const [consultores, setConsultores] = useState<User[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [cedentes, setCedentes] = useState<Cedente[]>([]);
  const [sacados, setSacados] = useState<Sacado[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConsultores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/consultores', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setConsultores(data.consultores || []);
    } catch {
      toast.error('Erro ao carregar consultores');
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
      case 'consultores':
        await loadConsultores();
        break;
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
  }, [activeTab, loadConsultores, loadFunds, loadCedentes, loadSacados]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApproveConsultor = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/users/${id}/approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: action === 'approve' ? 'APPROVED' : 'REJECTED' }),
      });

      if (!response.ok) throw new Error();

      toast.success(`Consultor ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadConsultores();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const handleApproveFund = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/funds/${id}/approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: action === 'approve' ? 'APPROVED' : 'REJECTED' }),
      });

      if (!response.ok) throw new Error();

      toast.success(`Fundo ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadFunds();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const handleApproveCedente = async (id: number, action: 'approve' | 'reject') => {
    try {
      await cedenteService.updateStatus(id.toString(), action === 'approve' ? 'approved' : 'rejected');
      toast.success(`Cedente ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadCedentes();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const handleApproveSacado = async (id: number, action: 'approve' | 'reject') => {
    try {
      await sacadoService.updateStatus(id.toString(), action === 'approve' ? 'approved' : 'rejected');
      toast.success(`Sacado ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadSacados();
    } catch {
      toast.error('Erro ao processar aprovação');
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
              onClick={() => setActiveTab('consultores')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'consultores'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Consultores
            </button>
            <button
              onClick={() => setActiveTab('fundos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fundos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Fundos
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

        {/* Content */}
        {activeTab === 'consultores' ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Consultores</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultores.map((consultor) => (
                    <div key={consultor.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{consultor.email}</h4>
                          <p className="text-sm text-gray-500">
                            Cadastrado em: {new Date(consultor.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            consultor.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            consultor.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {consultor.status === 'PENDING' ? 'Pendente' :
                             consultor.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                          </span>
                        </div>
                        {consultor.status === 'PENDING' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleApproveConsultor(consultor.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleApproveConsultor(consultor.id, 'reject')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {consultores.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum consultor cadastrado
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'fundos' ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Todos os Fundos</h3>
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
                          {fund.consultor && (
                            <p className="text-sm text-gray-500 mt-2">
                              Criado por: {fund.consultor.email}
                            </p>
                          )}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                            fund.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            fund.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            fund.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {fund.status === 'PENDING' ? 'Pendente' :
                             fund.status === 'APPROVED' ? 'Aprovado' :
                             fund.status === 'REJECTED' ? 'Rejeitado' : fund.status}
                          </span>
                        </div>
                        {fund.status === 'PENDING' && (
                          <div className="ml-4 space-x-2">
                            <button
                              onClick={() => handleApproveFund(fund.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleApproveFund(fund.id, 'reject')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {funds.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum fundo cadastrado
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'cedentes' ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Cedentes</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {cedentes.map((cedente) => (
                    <div key={cedente.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{cedente.name}</h4>
                          <p className="text-sm text-gray-600">CNPJ: {cedente.document || cedente.cnpj}</p>
                          {cedente.consultor && (
                            <p className="text-sm text-gray-500">
                              Cadastrado por: {cedente.consultor.email}
                            </p>
                          )}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                            cedente.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            cedente.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {cedente.status === 'PENDING' ? 'Pendente' :
                             cedente.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                          </span>
                        </div>
                        {cedente.status === 'PENDING' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleApproveCedente(cedente.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleApproveCedente(cedente.id, 'reject')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {cedentes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum cedente cadastrado
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Sacados</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {sacados.map((sacado) => (
                    <div key={sacado.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{sacado.name}</h4>
                          <p className="text-sm text-gray-600">CNPJ: {sacado.document || sacado.cnpj}</p>
                          {sacado.consultor && (
                            <p className="text-sm text-gray-500">
                              Cadastrado por: {sacado.consultor.email}
                            </p>
                          )}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                            sacado.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            sacado.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sacado.status === 'PENDING' ? 'Pendente' :
                             sacado.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                          </span>
                        </div>
                        {sacado.status === 'PENDING' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleApproveSacado(sacado.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleApproveSacado(sacado.id, 'reject')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {sacados.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum sacado cadastrado
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

export default GestorDashboard;