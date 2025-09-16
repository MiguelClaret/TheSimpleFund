import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  icon
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  const buttonClasses = `
    ${baseClasses} 
    ${variantClasses} 
    ${sizeClasses} 
    ${disabledClasses} 
    ${className}
  `.trim();
  
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { 
        y: -1,
        transition: { duration: 0.2 }
      }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
    >
      {loading && (
        <div className="spinner mr-2" />
      )}
      {!loading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </motion.button>
  );
};

// Specific button variants for common use cases
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => {
  return <Button {...props} variant="primary" />;
};

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => {
  return <Button {...props} variant="secondary" />;
};

export const AccentButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => {
  return <Button {...props} variant="accent" />;
};

export const SuccessButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => {
  return <Button {...props} variant="success" />;
};

export const WarningButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => {
  return <Button {...props} variant="warning" />;
};

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => {
  return <Button {...props} variant="danger" />;
};

export default Button;