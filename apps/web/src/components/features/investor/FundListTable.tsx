import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../common/Card';
import { Button } from '../../common/Button';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface Fund {
  id: string;
  name: string;
  symbol: string;
  description: string | null;
  price: number;
  totalIssued: number;
  maxSupply: number;
  targetAmount: number | null;
  status: string;
  createdAt: string;
}

interface FundListTableProps {
  funds: Fund[];
  loading?: boolean;
  onInvest: (fund: Fund) => void;
}

const FundListTable: React.FC<FundListTableProps> = ({
  funds,
  loading = false,
  onInvest
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredFunds = funds
    .filter(fund => 
      fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'closed':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/4"></div>
          <div className="h-10 bg-white/10 rounded"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-white/10 rounded"></div>
          ))}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard 
      title="Available Funds"
      subtitle="Discover and invest in tokenized funds"
      className="p-6"
    >
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Search funds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'createdAt')}
            className="form-input bg-white/5 border-white/10"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="createdAt">Sort by Date</option>
          </select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            icon={<FunnelIcon className="w-4 h-4" />}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Funds Table */}
      {filteredFunds.length === 0 ? (
        <div className="text-center py-12">
          <ChartBarIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white/60 mb-2">
            {searchTerm ? 'No funds found' : 'No funds available'}
          </h3>
          <p className="text-white/40">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'New funds will appear here when available'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFunds.map((fund, index) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {fund.symbol.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{fund.name}</h3>
                      <p className="text-sm text-white/60">{fund.symbol}</p>
                    </div>
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${getStatusColor(fund.status)}
                    `}>
                      {fund.status}
                    </div>
                  </div>
                  
                  {fund.description && (
                    <p className="text-sm text-white/70 mb-3 line-clamp-2">
                      {fund.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>${fund.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChartBarIcon className="w-4 h-4" />
                      <span>{fund.totalIssued.toLocaleString()} / {fund.maxSupply.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(fund.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onInvest(fund)}
                    disabled={fund.status.toLowerCase() !== 'active'}
                  >
                    Invest
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default FundListTable;
