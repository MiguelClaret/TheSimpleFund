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
import Button from '../components/common/Button/Button';

// Clean Card Component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

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
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
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

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <WalletIcon className="w-5 h-5" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  portfolioData.gainPercentage >= 0 ? 'text-green-200' : 'text-red-200'
                }`}>
                  {portfolioData.gainPercentage >= 0 ? (
                    <ArrowUpRightIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownRightIcon className="w-4 h-4" />
                  )}
                  <span>{formatPercent(portfolioData.gainPercentage)}</span>
                </div>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Balance</p>
                <p className="text-2xl font-bold">
                  {showBalance ? formatCurrency(portfolioData.totalValue) : '••••••'}
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
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Invested</p>
                <p className="text-xl font-bold text-gray-900">
                  {showBalance ? formatCurrency(portfolioData.totalInvested) : '••••••'}
                </p>
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
                  <ArrowUpRightIcon className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Gain</p>
                <p className="text-xl font-bold text-green-600">
                  {showBalance ? formatCurrency(portfolioData.totalGain) : '••••••'}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('marketplace')}
            className="p-4 bg-yellow-400 hover:bg-yellow-500 rounded-2xl text-black font-medium transition-colors"
          >
            <div className="flex flex-col items-center space-y-2">
              <PlusIcon className="w-6 h-6" />
              <span>Deposit</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('portfolio')}
            className="p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-700 font-medium transition-colors"
          >
            <div className="flex flex-col items-center space-y-2">
              <WalletIcon className="w-6 h-6" />
              <span>Withdraw</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-700 font-medium transition-colors"
          >
            <div className="flex flex-col items-center space-y-2">
              <CreditCardIcon className="w-6 h-6" />
              <span>Earn</span>
            </div>
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1 mb-6">
          {[
            { id: 'overview', label: 'Assets' },
            { id: 'marketplace', label: 'Marketplace' },
            { id: 'portfolio', label: 'History' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'marketplace' | 'portfolio')}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Assets List */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Hide 0 Balances
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {order.fund?.symbol?.slice(0, 2) || 'FD'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.fund?.name || 'Fund Investment'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.quantity} shares
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-sm text-green-600">+2.5%</p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {orders.length === 0 && (
                      <div className="text-center py-12">
                        <CreditCardIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No assets yet</h3>
                        <p className="text-gray-500 mb-4">Start investing to build your portfolio</p>
                        <Button
                          onClick={() => setActiveTab('marketplace')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Explore Marketplace
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Available Funds</h3>
                  <div className="text-sm text-gray-500">
                    {funds.length} funds available
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <Card className="p-6">
                          <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {funds.map((fund, index) => {
                      const soldPercentage = fund.maxSupply > 0 ? (fund.totalIssued / fund.maxSupply) * 100 : 0;
                      
                      return (
                        <motion.div
                          key={fund.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -2 }}
                        >
                          <Card className="p-6 hover:shadow-md transition-all duration-200 cursor-pointer">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{fund.name}</h4>
                                  <p className="text-sm text-gray-500">{fund.symbol}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(fund.price)}
                                  </p>
                                  <p className="text-xs text-gray-500">per share</p>
                                </div>
                              </div>

                              {fund.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {fund.description}
                                </p>
                              )}

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Progress</span>
                                  <span className="text-gray-900 font-medium">{soldPercentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>{fund.totalIssued.toLocaleString()} shares</span>
                                  <span>{fund.maxSupply.toLocaleString()} total</span>
                                </div>
                              </div>

                              <Button
                                onClick={() => handleInvest(fund)}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-xl"
                              >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Buy Now
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {!loading && funds.length === 0 && (
                  <div className="text-center py-12">
                    <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No funds available</h3>
                    <p className="text-gray-500">Check back later for new investment opportunities</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full font-medium">
                        All
                      </button>
                      <button className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 rounded-full">
                        Buy
                      </button>
                      <button className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 rounded-full">
                        Sell
                      </button>
                    </div>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <WalletIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                      <p className="text-gray-500">Your transaction history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <ArrowUpRightIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Buy {order.fund?.name || 'Fund'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('en-US')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(order.total)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              order.status === 'completed' 
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Modals */}
        {showAccessDenied && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-md mx-auto"
            >
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Access Denied</h3>
                  <p className="text-gray-600">Your account needs approval to invest in funds.</p>
                  <Button 
                    onClick={() => setShowAccessDenied(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Close
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
        
        {selectedFund && isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-md mx-auto"
            >
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Invest in {selectedFund.name}</h3>
                  <p className="text-gray-600">Investment functionality would be implemented here.</p>
                  <div className="flex space-x-3">
                    <Button 
                      onClick={() => {
                        setIsModalOpen(false);
                        setSelectedFund(null);
                        handleInvestmentComplete();
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Simulate Investment
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsModalOpen(false);
                        setSelectedFund(null);
                      }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvestidorDashboard;