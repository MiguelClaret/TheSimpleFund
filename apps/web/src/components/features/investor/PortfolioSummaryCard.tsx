import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../common/Card';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  BanknotesIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

interface PortfolioSummaryProps {
  totalInvested: number;
  totalValue: number;
  totalReturn: number;
  fundsCount: number;
  loading?: boolean;
}

const PortfolioSummaryCard: React.FC<PortfolioSummaryProps> = ({
  totalInvested,
  totalValue,
  totalReturn,
  fundsCount,
  loading = false
}) => {
  const returnPercentage = totalInvested > 0 ? ((totalReturn / totalInvested) * 100) : 0;
  const isPositive = totalReturn >= 0;

  const stats = [
    {
      label: 'Total Invested',
      value: totalInvested,
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      format: 'currency'
    },
    {
      label: 'Portfolio Value',
      value: totalValue,
      icon: <ChartBarIcon className="w-6 h-6" />,
      format: 'currency'
    },
    {
      label: 'Total Return',
      value: totalReturn,
      icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
      format: 'currency',
      percentage: returnPercentage,
      isPositive
    },
    {
      label: 'Active Funds',
      value: fundsCount,
      icon: <BanknotesIcon className="w-6 h-6" />,
      format: 'number'
    }
  ];

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-8 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard 
      title="Portfolio Overview"
      subtitle="Your investment summary"
      className="p-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="flex justify-center mb-3">
              <div className={`
                p-3 rounded-xl
                ${stat.isPositive === false ? 'bg-red-500/20 text-red-400' : 
                  stat.isPositive === true ? 'bg-green-500/20 text-green-400' : 
                  'bg-white/10 text-white/80'}
              `}>
                {stat.icon}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-white/60 uppercase tracking-wide">
                {stat.label}
              </p>
              <div className="space-y-1">
                <p className={`
                  text-xl font-bold
                  ${stat.isPositive === false ? 'text-red-400' : 
                    stat.isPositive === true ? 'text-green-400' : 
                    'text-white'}
                `}>
                  {stat.format === 'currency' 
                    ? `$${stat.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    : stat.value.toLocaleString()
                  }
                </p>
                {stat.percentage !== undefined && (
                  <p className={`
                    text-sm font-medium
                    ${isPositive ? 'text-green-400' : 'text-red-400'}
                  `}>
                    {isPositive ? '+' : ''}{stat.percentage.toFixed(2)}%
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default PortfolioSummaryCard;
