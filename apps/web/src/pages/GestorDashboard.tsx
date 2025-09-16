import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cedenteService, sacadoService, fundService, userService } from '../services/api';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { 
  UserManagementTable, 
  FundManagementTable, 
  EntityManagementTable 
} from '../components/features/manager';
import { Card } from '../components/ui/Card';
import { PrimaryButton, SuccessButton, SecondaryButton } from '../components/ui/Button';

// Icons
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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

  // Calculate dashboard stats
  const totalUsers = consultores.length + investidores.length;
  const pendingApprovals = [
    ...consultores.filter(c => c.status === 'pending'),
    ...investidores.filter(i => i.status === 'pending'),
    ...funds.filter(f => f.status === 'PENDING'),
    ...cedentes.filter(c => c.status === 'pending'),
    ...sacados.filter(s => s.status === 'pending')
  ].length;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      change: '+12%',
      icon: <UsersIcon />,
      color: 'text-blue-600'
    },
    {
      title: 'Active Funds',
      value: funds.filter(f => f.status === 'APPROVED').length.toString(),
      change: '+8%',
      icon: <TrendingUpIcon />,
      color: 'text-green-600'
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals.toString(),
      change: '-3%',
      icon: <ClockIcon />,
      color: 'text-orange-600'
    },
    {
      title: 'Total Entities',
      value: (cedentes.length + sacados.length).toString(),
      change: '+24%',
      icon: <SettingsIcon />,
      color: 'text-purple-600'
    }
  ];

  const tabs = [
    { id: 'consultores', label: 'Consultants', icon: <UsersIcon /> },
    { id: 'investidores', label: 'Investors', icon: <UsersIcon /> },
    { id: 'fundos', label: 'Funds', icon: <TrendingUpIcon /> },
    { id: 'cedentes', label: 'Assignors', icon: <SettingsIcon /> },
    { id: 'sacados', label: 'Debtors', icon: <SettingsIcon /> },
  ];

  return (
    <DashboardLayout title="Management Dashboard">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Center</h1>
          <p className="text-gray-600 text-lg">Control and approve all platform operations</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gray-100 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <InformationCircleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Control Center</h3>
                <div className="text-sm text-gray-700 space-y-3">
                  <p>As a manager, you have comprehensive platform oversight:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <p className="font-medium text-blue-600 flex items-center gap-2">
                        <UsersIcon />
                        Users
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Approve consultants and investors</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-purple-100">
                      <p className="font-medium text-purple-600 flex items-center gap-2">
                        <TrendingUpIcon />
                        Funds
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Review and approve fund creation</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-100">
                      <p className="font-medium text-green-600 flex items-center gap-2">
                        <SettingsIcon />
                        Entities
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Manage assignors and debtors</p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 pt-2 flex items-center gap-1">
                    🔒 All operations are audited and recorded on blockchain
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton size="sm">
                <UsersIcon />
                Approve Users
              </PrimaryButton>
              <SecondaryButton size="sm">
                <TrendingUpIcon />
                Review Funds
              </SecondaryButton>
              <SuccessButton size="sm">
                <CheckCircleIcon />
                Bulk Approve
              </SuccessButton>
              <SecondaryButton size="sm">
                <SettingsIcon />
                System Settings
              </SecondaryButton>
            </div>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="p-2">
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'consultores' | 'investidores' | 'fundos' | 'cedentes' | 'sacados')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex-1 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'consultores' && (
            <UserManagementTable
              users={consultores}
              title="Consultants"
              loading={loading}
              onApprove={handleApproveConsultor}
            />
          )}

          {activeTab === 'investidores' && (
            <UserManagementTable
              users={investidores}
              title="Investors"
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
              title="Assignors"
              loading={loading}
              onApprove={handleApproveCedente}
            />
          )}

          {activeTab === 'sacados' && (
            <EntityManagementTable
              entities={sacados}
              title="Debtors"
              loading={loading}
              onApprove={handleApproveSacado}
            />
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default GestorDashboard;