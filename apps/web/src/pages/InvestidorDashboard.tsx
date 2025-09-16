import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  WalletIcon,
  EyeIcon,
  EyeSlashIcon,
  ChartBarIcon,
  CreditCardIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/useAuth';
import { fundService, orderService } from '../services/api';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { GlassCard } from '../components/common/Card';
import Button from '../components/common/Button/Button';

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'marketplace' | 'portfolio'>('overview');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Mock data for better visualization
  const portfolioData = {
    totalValue: 15487.23,
    totalInvested: 12000,
    totalGain: 3487.23,
    gainPercentage: 29.06,
    monthlyChange: 847.15,
    monthlyChangePercentage: 5.8
  };

  const loadFunds = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fundService.list();
      // Filter only approved funds
      const approvedFunds = data.filter((fund: Fund) => fund.status.toLowerCase() === 'approved');
      setFunds(approvedFunds);
    } catch (error) {
      console.error('Error loading funds:', error);
      toast.error('Failed to load funds');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const data = await orderService.list();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }, []);

  useEffect(() => {
    loadFunds();
    loadOrders();
  }, [loadFunds, loadOrders]);

  const handleInvest = (fund: Fund) => {
    if (user?.status !== 'approved') {
      setShowAccessDenied(true);
      return;
    }
    setSelectedFund(fund);
    setIsModalOpen(true);
  };

  const handleInvestmentComplete = () => {
    setIsModalOpen(false);
    setSelectedFund(null);
    loadOrders();
    toast.success('Investment completed successfully!');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <DashboardLayout title="Investment Dashboard">
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

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-400/30">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <WalletIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Portfolio Balance</p>
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

              <div className="space-y-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-white">
                    {showBalance ? formatCurrency(portfolioData.totalValue) : '••••••'}
                  </span>
                  <div className={`flex items-center space-x-1 text-sm ${
                    portfolioData.gainPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {portfolioData.gainPercentage >= 0 ? (
                      <ArrowUpRightIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownRightIcon className="w-4 h-4" />
                    )}
                    <span>{formatPercent(portfolioData.gainPercentage)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Total Invested</p>
                    <p className="text-lg font-semibold text-white">
                      {showBalance ? formatCurrency(portfolioData.totalInvested) : '••••••'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Gain</p>
                    <p className="text-lg font-semibold text-green-400">
                      {showBalance ? formatCurrency(portfolioData.totalGain) : '••••••'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-white/10">
                <Button
                  onClick={() => setActiveTab('marketplace')}
                  className="flex-1 bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Invest
                </Button>
                <Button
                  onClick={() => setActiveTab('portfolio')}
                  variant="secondary"
                  className="flex-1"
                >
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 p-1 bg-white/5 rounded-xl">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'marketplace', label: 'Marketplace', icon: PlusIcon },
            { id: 'portfolio', label: 'Portfolio', icon: CreditCardIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'marketplace' | 'portfolio')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white'
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Performance Charts */}
                <GlassCard>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Performance</h3>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
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
                    
                    {/* Mock Chart Area */}
                    <div className="h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center border border-white/10">
                      <div className="text-center">
                        <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Performance Chart</p>
                        <p className="text-xs text-gray-500">Chart visualization would go here</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Recent Transactions */}
                <GlassCard>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                      <button className="text-sm text-blue-400 hover:text-blue-300">
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                              <ArrowUpRightIcon className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {order.fund?.name || 'Fund Investment'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-white">
                              {formatCurrency(order.total)}
                            </p>
                            <p className="text-xs text-green-400">{order.status}</p>
                          </div>
                        </motion.div>
                      ))}
                      
                      {orders.length === 0 && (
                        <div className="text-center py-8">
                          <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400">No transactions yet</p>
                          <p className="text-sm text-gray-500">Start investing to see your activity</p>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Available Funds</h3>
                  <div className="text-sm text-gray-400">
                    {funds.length} funds available
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <GlassCard>
                          <div className="p-6 space-y-4">
                            <div className="h-4 bg-white/10 rounded"></div>
                            <div className="h-3 bg-white/10 rounded w-3/4"></div>
                            <div className="h-8 bg-white/10 rounded"></div>
                          </div>
                        </GlassCard>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {funds.map((fund, index) => {
                      const soldPercentage = fund.maxSupply > 0 ? (fund.totalIssued / fund.maxSupply) * 100 : 0;
                      
                      return (
                        <motion.div
                          key={fund.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <GlassCard className="hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="p-6 space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-white">{fund.name}</h4>
                                  <p className="text-sm text-gray-400">{fund.symbol}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-white">
                                    {formatCurrency(fund.price)}
                                  </p>
                                  <p className="text-xs text-gray-400">per share</p>
                                </div>
                              </div>

                              {fund.description && (
                                <p className="text-sm text-gray-300 line-clamp-2">
                                  {fund.description}
                                </p>
                              )}

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Progress</span>
                                  <span className="text-white">{soldPercentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>{fund.totalIssued.toLocaleString()} shares</span>
                                  <span>{fund.maxSupply.toLocaleString()} total</span>
                                </div>
                              </div>

                              <Button
                                onClick={() => handleInvest(fund)}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                              >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Invest Now
                              </Button>
                            </div>
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {!loading && funds.length === 0 && (
                  <div className="text-center py-12">
                    <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No funds available</h3>
                    <p className="text-gray-400">Check back later for new investment opportunities</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <GlassCard>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Wallet Connection</h3>
                      <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                        Connect Wallet
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Connect your Stellar wallet to manage your investments
                    </p>
                  </div>
                </GlassCard>
                
                <GlassCard>
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">My Investments</h3>
                    
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <WalletIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">No investments yet</p>
                        <p className="text-sm text-gray-500">Start investing to build your portfolio</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.map((order, index) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-white">
                                  {order.fund?.name || 'Fund Investment'}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  {order.quantity} shares at {formatCurrency(order.price)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-white">
                                  {formatCurrency(order.total)}
                                </p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  order.status === 'completed' 
                                    ? 'bg-green-500/20 text-green-400'
                                    : order.status === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Simple Modal Placeholders */}
        {showAccessDenied && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <GlassCard className="max-w-md mx-4">
              <div className="p-6 text-center space-y-4">
                <h3 className="text-lg font-semibold text-white">Access Denied</h3>
                <p className="text-gray-400">Your account needs approval to invest in funds.</p>
                <Button onClick={() => setShowAccessDenied(false)}>
                  Close
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
        
        {selectedFund && isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <GlassCard className="max-w-md mx-4">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Invest in {selectedFund.name}</h3>
                <p className="text-gray-400">Investment functionality would be implemented here.</p>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedFund(null);
                      handleInvestmentComplete();
                    }}
                    className="flex-1"
                  >
                    Simulate Investment
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedFund(null);
                    }}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvestidorDashboard;