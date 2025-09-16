import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  ChartBarIcon, 
  BanknotesIcon, 
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
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
  const [showBalance, setShowBalance] = useState(true);
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
        monthlyCommission: totalAUM * 0.01,
        totalClients: fundsData.length * 15 + Math.floor(Math.random() * 50)
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
    console.log('Gerenciar fundo:', fund.id);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <DashboardLayout title="Consultant Dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </motion.div>

        {/* Stats Overview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-400/30">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <ChartBarIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Assets Under Management</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {showBalance ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-white">
                    {showBalance ? formatCurrency(stats.totalAssetsUnderManagement) : '••••••'}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-green-400">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    <span>+12.5%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Monthly Commission</p>
                    <p className="text-lg font-semibold text-green-400">
                      {showBalance ? formatCurrency(stats.monthlyCommission) : '••••••'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Clients</p>
                    <p className="text-lg font-semibold text-blue-400">
                      {stats.totalClients}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BanknotesIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.totalFunds}</p>
                  <p className="text-xs text-gray-400">Total Funds</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-green-400">{stats.activeFunds}</p>
                  <p className="text-xs text-gray-400">Active</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ClockIcon className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pendingApproval}</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => setActiveTab('create')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Fund
                </Button>
                <Button
                  onClick={() => setActiveTab('funds')}
                  variant="secondary"
                  className="flex-1"
                >
                  <BanknotesIcon className="w-4 h-4 mr-2" />
                  Manage Funds
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 p-1 bg-white/5 rounded-xl">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'funds', label: 'My Funds', icon: BanknotesIcon },
            { id: 'create', label: 'Create Fund', icon: PlusIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'funds' | 'create')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Overview */}
              <GlassCard>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Fund Performance</h3>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                        7D
                      </button>
                      <button className="px-3 py-1 text-xs text-gray-400 hover:text-white rounded-full">
                        1M
                      </button>
                      <button className="px-3 py-1 text-xs text-gray-400 hover:text-white rounded-full">
                        3M
                      </button>
                    </div>
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg flex items-center justify-center border border-white/10">
                    <div className="text-center">
                      <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Performance Analytics</p>
                      <p className="text-xs text-gray-500">Fund performance metrics would display here</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Recent Activity */}
              <GlassCard>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                    <button className="text-sm text-purple-400 hover:text-purple-300">
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {funds.slice(0, 3).map((fund, index) => (
                      <motion.div
                        key={fund.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            fund.status === 'approved' 
                              ? 'bg-green-500/20' 
                              : fund.status === 'pending'
                              ? 'bg-yellow-500/20'
                              : 'bg-red-500/20'
                          }`}>
                            {fund.status === 'approved' ? (
                              <CheckCircleIcon className="w-4 h-4 text-green-400" />
                            ) : fund.status === 'pending' ? (
                              <ClockIcon className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{fund.name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(fund.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {formatCurrency(fund.totalIssued * fund.price)}
                          </p>
                          <p className={`text-xs capitalize ${
                            fund.status === 'approved' ? 'text-green-400' :
                            fund.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {fund.status}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {funds.length === 0 && (
                      <div className="text-center py-8">
                        <BanknotesIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">No funds created yet</p>
                        <p className="text-sm text-gray-500">Create your first fund to get started</p>
                      </div>
                    )}
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