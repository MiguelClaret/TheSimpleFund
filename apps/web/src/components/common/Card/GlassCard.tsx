import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  highlighted?: boolean;
  className?: string;
  animated?: boolean;
  hoverScale?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  onClick,
  disabled = false,
  highlighted = false,
  className = '',
  animated = true,
  hoverScale = 1.02
}) => {
  const baseClasses = `
    glass-card 
    ${onClick ? 'cursor-pointer' : ''} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${highlighted ? 'border-white/30 bg-white/10' : ''}
    ${className}
  `;

  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as any },
    whileHover: onClick && !disabled ? { 
      scale: hoverScale,
      transition: { duration: 0.2 }
    } : undefined,
    whileTap: onClick && !disabled ? { scale: 0.98 } : undefined
  };

  if (!animated) {
    return (
      <div
        className={baseClasses}
        onClick={disabled ? undefined : onClick}
      >
        {(title || subtitle || icon) && (
          <div className="flex items-start gap-4 mb-6">
            {icon && (
              <div className="flex-shrink-0 p-3 rounded-xl bg-white/10">
                {icon}
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="text-card-title text-white mb-2">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-subtitle">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      onClick={disabled ? undefined : onClick}
      {...animationProps}
    >
      {(title || subtitle || icon) && (
        <div className="flex items-start gap-4 mb-6">
          {icon && (
            <div className="flex-shrink-0 p-3 rounded-xl bg-white/10">
              {icon}
            </div>
          )}
          <div className="flex-1">
            {title && (
              <h3 className="text-card-title text-white mb-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;