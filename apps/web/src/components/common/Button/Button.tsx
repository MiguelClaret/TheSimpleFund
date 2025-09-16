import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'tsf-button';
  const variantClasses = `tsf-button--${variant}`;
  const sizeClasses = `tsf-button--${size}`;
  const loadingClasses = loading ? 'tsf-button--loading' : '';
  const disabledClasses = (disabled || loading) ? 'tsf-button--disabled' : '';
  const fullWidthClasses = fullWidth ? 'tsf-button--full-width' : '';

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    loadingClasses,
    disabledClasses,
    fullWidthClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="tsf-button__spinner">
          <div className="tsf-spinner"></div>
        </div>
      )}
      <span className={loading ? 'tsf-button__content--hidden' : 'tsf-button__content'}>
        {icon && <span className="tsf-button__icon">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default Button;