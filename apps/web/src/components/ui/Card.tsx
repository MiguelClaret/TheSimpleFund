import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'purple' | 'blue' | 'balance';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  onClick 
}) => {
  const baseClasses = 'transition-all duration-200 ease-out';
  
  const variantClasses = {
    default: 'card',
    purple: 'card-purple',
    blue: 'card-blue',
    balance: 'balance-card'
  };
  
  const hoverClasses = hover ? 'hover:shadow-card-hover hover:-translate-y-0.5' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const cardClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${hoverClasses} 
    ${clickableClasses} 
    ${className}
  `.trim();
  
  if (hover) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={{ 
          y: -2,
          transition: { duration: 0.2 }
        }}
        whileTap={onClick ? { scale: 0.98 } : {}}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

// Balance Card specifically styled for main balance display
export const BalanceCard: React.FC<Omit<CardProps, 'variant'>> = (props) => {
  return <Card {...props} variant="balance" />;
};

// Quick Action Card for action buttons
export const QuickActionCard: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'primary';
}> = ({ children, onClick, className = '', variant = 'default' }) => {
  const variantClasses = {
    default: 'quick-action',
    primary: 'quick-action quick-action-primary'
  };
  
  return (
    <motion.div
      className={`${variantClasses[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;