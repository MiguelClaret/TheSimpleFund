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
import Button from '../components/common/Button/Button';
import { useAuth } from '../contexts/useAuth';
import { CreateFundForm, ConsultantFundList } from '../components/features/consultant';
import api from '../services/api';

// Clean Card Component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

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
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fund Management</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {showBalance ? (
              <EyeSlashIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-1 text-sm text-purple-100">
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div>
                <p className="text-purple-100 text-sm mb-1">AUM</p>
                <p className="text-2xl font-bold">
                  {showBalance ? formatCurrency(stats.totalAssetsUnderManagement) : '••••••'}
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BanknotesIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Funds</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalFunds}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Active Funds</p>
                <p className="text-xl font-bold text-green-600">{stats.activeFunds}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Pending</p>
                <p className="text-xl font-bold text-yellow-600">{stats.pendingApproval}</p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Commission Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BanknotesIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-green-600 text-sm font-medium">Monthly Commission</p>
                  <p className="text-2xl font-bold text-green-700">
                    {showBalance ? formatCurrency(stats.monthlyCommission) : '••••••'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-600 text-sm">Total Clients</p>
                <p className="text-xl font-bold text-green-700">{stats.totalClients}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('create')}
            className="p-6 bg-purple-500 hover:bg-purple-600 rounded-2xl text-white font-medium transition-colors"
          >
            <div className="flex items-center space-x-4">
              <PlusIcon className="w-8 h-8" />
              <div className="text-left">
                <p className="text-lg font-semibold">Create Fund</p>
                <p className="text-purple-100 text-sm">Launch a new investment fund</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('funds')}
            className="p-6 bg-blue-500 hover:bg-blue-600 rounded-2xl text-white font-medium transition-colors"
          >
            <div className="flex items-center space-x-4">
              <BanknotesIcon className="w-8 h-8" />
              <div className="text-left">
                <p className="text-lg font-semibold">Manage Funds</p>
                <p className="text-blue-100 text-sm">Monitor and update your funds</p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'funds', label: 'My Funds' },
            { id: 'create', label: 'Create Fund' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'funds' | 'create')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Fund Performance */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Fund Performance</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-full font-medium">
                      7D
                    </button>
                    <button className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 rounded-full">
                      1M
                    </button>
                    <button className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 rounded-full">
                      3M
                    </button>
                  </div>
                </div>
                
                {/* Mock Chart */}
                <div className="h-48 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <ChartBarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analytics</h3>
                    <p className="text-gray-500">Fund performance metrics would display here</p>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {funds.slice(0, 5).map((fund, index) => (
                    <motion.div
                      key={fund.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          fund.status === 'approved' 
                            ? 'bg-green-100' 
                            : fund.status === 'pending'
                            ? 'bg-yellow-100'
                            : 'bg-red-100'
                        }`}>
                          {fund.status === 'approved' ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          ) : fund.status === 'pending' ? (
                            <ClockIcon className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{fund.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(fund.createdAt).toLocaleDateString('en-US')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(fund.totalIssued * fund.price)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                          fund.status === 'approved' ? 'bg-green-100 text-green-700' :
                          fund.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {fund.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  {funds.length === 0 && (
                    <div className="text-center py-12">
                      <BanknotesIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No funds created yet</h3>
                      <p className="text-gray-500 mb-4">Create your first fund to get started</p>
                      <Button
                        onClick={() => setActiveTab('create')}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Fund
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
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