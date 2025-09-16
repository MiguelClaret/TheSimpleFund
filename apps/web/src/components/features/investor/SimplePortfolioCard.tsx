import React from 'react';
import { CurrencyDollarIcon, ChartBarIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '../../common/Card';

interface SimplePortfolioCardProps {
  totalInvested: number;
  activeFunds: number;
  totalOrders: number;
}

const SimplePortfolioCard: React.FC<SimplePortfolioCardProps> = ({
  totalInvested,
  activeFunds,
  totalOrders
}) => {
  const stats = [
    {
      label: 'Total Investido',
      value: `R$ ${totalInvested.toLocaleString('pt-BR')}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      label: 'Fundos Ativos',
      value: activeFunds.toString(),
      icon: ChartBarIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      label: 'Total de Ordens',
      value: totalOrders.toString(),
      icon: BanknotesIcon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

  return (
    <GlassCard>
      <h3 className="text-lg font-medium text-white mb-6">Resumo do Portfólio</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-300">{stat.label}</p>
              <p className="text-xl font-semibold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default SimplePortfolioCard;