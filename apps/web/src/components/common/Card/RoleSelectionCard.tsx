import React from 'react';
import { motion } from 'framer-motion';
import type { UserRoleType } from '../../../types';

interface RoleSelectionCardProps {
  role: UserRoleType;
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: (role: UserRoleType) => void;
  index?: number;
}

const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  role,
  icon,
  title,
  description,
  isSelected,
  onClick,
  index = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className={`
        role-card p-8 text-center
        ${isSelected ? 'selected' : ''}
      `}
      onClick={() => onClick(role)}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Icon Container */}
        <div className={`
          p-6 rounded-2xl transition-all duration-300
          ${isSelected 
            ? 'bg-white/20 text-white' 
            : 'bg-white/10 text-white/80'
          }
        `}>
          <div className="w-12 h-12">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className={`
            text-xl font-bold transition-colors duration-300
            ${isSelected ? 'text-white' : 'text-white/90'}
          `}>
            {title}
          </h3>
          
          <p className={`
            text-sm leading-relaxed transition-colors duration-300
            ${isSelected ? 'text-white/90' : 'text-white/70'}
          `}>
            {description}
          </p>
        </div>

        {/* Selection Indicator */}
        <div className={`
          w-3 h-3 rounded-full transition-all duration-300
          ${isSelected 
            ? 'bg-white shadow-lg shadow-white/30' 
            : 'bg-white/30'
          }
        `} />
      </div>

      {/* Glow Effect for Selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
            filter: 'blur(20px)',
            zIndex: -1
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default RoleSelectionCard;