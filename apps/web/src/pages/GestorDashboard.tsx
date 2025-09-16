import React, { useState, useEffect, useCallback } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { cedenteService, sacadoService, fundService, userService } from '../services/api';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { 
  UserManagementTable, 
  FundManagementTable, 
  EntityManagementTable 
} from '../components/features/manager';
import { GlassCard } from '../components/common/Card';

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
  const [activeTab, setActiveTab] = useState<'consultores' | 'investidores' | 'fundos' | 'cedentes' | 'sacados'>('consultores');
  const [consultores, setConsultores] = useState<User[]>([]);
  const [investidores, setInvestidores] = useState<User[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [cedentes, setCedentes] = useState<Cedente[]>([]);
  const [sacados, setSacados] = useState<Sacado[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConsultores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getConsultores();
      setConsultores(data);
    } catch {
      toast.error('Erro ao carregar consultores');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInvestidores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getInvestidores();
      setInvestidores(data);
    } catch {
      toast.error('Erro ao carregar investidores');
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
      case 'investidores':
        await loadInvestidores();
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
  }, [activeTab, loadConsultores, loadInvestidores, loadFunds, loadCedentes, loadSacados]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApproveConsultor = async (id: string, action: 'approve' | 'reject') => {
    try {
      await userService.approveUser(id, action);
      toast.success(`Consultor ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadConsultores();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const handleApproveInvestidor = async (id: string, action: 'approve' | 'reject') => {
    try {
      await userService.approveUser(id, action);
      toast.success(`Investidor ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadInvestidores();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const handleApproveFund = async (id: string, action: 'approve' | 'reject') => {
    try {
      await fundService.approve(id, action === 'approve' ? 'APPROVED' : 'REJECTED');
      toast.success(`Fundo ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadFunds();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const handleDeactivateFund = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar este fundo?')) return;
    
    try {
      await fundService.deactivate(id);
      toast.success('Fundo desativado com sucesso!');
      loadFunds();
    } catch {
      toast.error('Erro ao desativar fundo');
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
    <DashboardLayout title="Dashboard do Gestor">
      {/* Welcome Section */}
      <GlassCard className="border-purple-300/40 mb-8 bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-xl">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-purple-400/30 rounded-lg backdrop-blur-sm">
            <InformationCircleIcon className="w-6 h-6 text-purple-200" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Management Center</h3>
            <div className="text-sm text-gray-200 space-y-2">
              <p>As manager, you have full platform control:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-200">
                <li><strong className="text-white">Users:</strong> Approve consultants and investors</li>
                <li><strong className="text-white">Funds:</strong> Review and approve created funds</li>
                <li><strong className="text-white">Entities:</strong> Manage assignors and debtors</li>
              </ul>
              <p className="text-xs text-purple-200 pt-2">
                🔒 All operations are audited and recorded on blockchain
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1 p-1 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
          {[
            { id: 'consultores', label: 'Consultants' },
            { id: 'investidores', label: 'Investors' },
            { id: 'fundos', label: 'Funds' },
            { id: 'cedentes', label: 'Assignors' },
            { id: 'sacados', label: 'Debtors' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'consultores' | 'investidores' | 'fundos' | 'cedentes' | 'sacados')}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white shadow-lg'
                  : 'text-gray-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'consultores' && (
          <UserManagementTable
            users={consultores}
            title="Consultores"
            loading={loading}
            onApprove={handleApproveConsultor}
          />
        )}

        {activeTab === 'investidores' && (
          <UserManagementTable
            users={investidores}
            title="Investidores"
            loading={loading}
            onApprove={handleApproveInvestidor}
          />
        )}

        {activeTab === 'fundos' && (
          <FundManagementTable
            funds={funds}
            loading={loading}
            onApprove={handleApproveFund}
            onDeactivate={handleDeactivateFund}
          />
        )}

        {activeTab === 'cedentes' && (
          <EntityManagementTable
            entities={cedentes}
            title="Cedentes"
            loading={loading}
            onApprove={handleApproveCedente}
          />
        )}

        {activeTab === 'sacados' && (
          <EntityManagementTable
            entities={sacados}
            title="Sacados"
            loading={loading}
            onApprove={handleApproveSacado}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default GestorDashboard;