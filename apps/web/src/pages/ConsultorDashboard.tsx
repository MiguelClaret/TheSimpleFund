import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  ChartBarIcon, 
  BanknotesIcon, 
  UsersIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { GlassCard } from '../components/common/Card';
import Button from '../components/common/Button/Button';
import { useAuth } from '../contexts/useAuth';
import { CreateFundForm, ConsultantFundList } from '../components/features/consultant';
import api from '../services/api';

interface ConsultorStats {
  totalFunds: number;
  activeFunds: number;
  pendingApproval: number;
  totalAssetsUnderManagement: number;
  monthlyCommission: number;
  totalClients: number;
}

interface Fund {
  id: string;
  name: string;
  symbol: string;
  description: string;
  targetAmount: number | null;
  maxSupply: number;
  totalIssued: number;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  consultorId?: string;
}

const ConsultorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'funds' | 'create'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [stats, setStats] = useState<ConsultorStats>({
    totalFunds: 0,
    activeFunds: 0,
    pendingApproval: 0,
    totalAssetsUnderManagement: 0,
    monthlyCommission: 0,
    totalClients: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Buscar fundos do consultor
      const fundsResponse = await api.get('/fund/consultant');
      const fundsData = fundsResponse.data || [];
      setFunds(fundsData);

      // Calcular estatísticas
      const activeFunds = fundsData.filter((f: Fund) => f.status === 'approved').length;
      const pendingApproval = fundsData.filter((f: Fund) => f.status === 'pending').length;
      const totalAUM = fundsData.reduce((sum: number, f: Fund) => sum + (f.totalIssued * f.price), 0);
      
      setStats({
        totalFunds: fundsData.length,
        activeFunds,
        pendingApproval,
        totalAssetsUnderManagement: totalAUM,
        monthlyCommission: totalAUM * 0.01, // Estimativa de 1% de comissão
        totalClients: fundsData.length * 10 + Math.floor(Math.random() * 50) // Mock data
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundCreated = () => {
    fetchData();
    setActiveTab('funds');
  };

  const handleManageFund = (fund: Fund) => {
    // Implementar navegação para gestão de cedentes/sacados
    console.log('Gerenciar fundo:', fund.id);
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: ChartBarIcon },
    { id: 'funds', label: 'Meus Fundos', icon: BanknotesIcon },
    { id: 'create', label: 'Criar Fundo', icon: PlusIcon },
  ] as const;

  return (
    <DashboardLayout title="Painel do Consultor">
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Painel do Consultor
          </div>
          <p className="text-xl text-gray-300">
            Bem-vindo, {user?.email}! Gerencie seus fundos e clientes aqui.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <GlassCard>
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GlassCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total de Fundos</p>
                      <p className="text-2xl font-bold text-white">{stats.totalFunds}</p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <BanknotesIcon className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Fundos Ativos</p>
                      <p className="text-2xl font-bold text-green-400">{stats.activeFunds}</p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <ArrowTrendingUpIcon className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Aguardando Aprovação</p>
                      <p className="text-2xl font-bold text-yellow-400">{stats.pendingApproval}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <ClockIcon className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Patrimônio Sob Gestão</p>
                      <p className="text-2xl font-bold text-purple-400">
                        R$ {stats.totalAssetsUnderManagement.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <ChartBarIcon className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Comissão Mensal</p>
                      <p className="text-2xl font-bold text-green-400">
                        R$ {stats.monthlyCommission.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <BanknotesIcon className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total de Clientes</p>
                      <p className="text-2xl font-bold text-blue-400">{stats.totalClients}</p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <UsersIcon className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Quick Actions */}
              <GlassCard>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Ações Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => setActiveTab('create')}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Criar Novo Fundo
                    </Button>
                    <Button
                      onClick={() => setActiveTab('funds')}
                      variant="secondary"
                      className="w-full"
                    >
                      <BanknotesIcon className="w-5 h-5 mr-2" />
                      Gerenciar Fundos
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'funds' && (
            <ConsultantFundList
              funds={funds}
              loading={isLoading}
              onManageFund={handleManageFund}
            />
          )}

          {activeTab === 'create' && (
            <CreateFundForm onFundCreated={handleFundCreated} />
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ConsultorDashboard;