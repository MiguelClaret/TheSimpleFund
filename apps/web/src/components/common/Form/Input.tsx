import React from 'react';
import './Form.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'financial';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'tsf-input';
  const variantClasses = `tsf-input--${variant}`;
  const errorClasses = error ? 'tsf-input--error' : '';
  const iconLeftClasses = leftIcon ? 'tsf-input--with-left-icon' : '';
  const iconRightClasses = rightIcon ? 'tsf-input--with-right-icon' : '';

  const inputClasses = [
    baseClasses,
    variantClasses,
    errorClasses,
    iconLeftClasses,
    iconRightClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="tsf-input-wrapper">
      {label && (
        <label className="tsf-input-label" htmlFor={props.id}>
          {label}
          {props.required && <span className="tsf-input-required">*</span>}
        </label>
      )}
      
      <div className="tsf-input-container">
        {leftIcon && (
          <div className="tsf-input-icon tsf-input-icon--left" style={{ display: 'flex', alignItems: 'center' }}>
            {leftIcon}
          </div>
        )}
        
        <input className={inputClasses} {...props} />
        
        {rightIcon && (
          <div className="tsf-input-icon tsf-input-icon--right" style={{ display: 'flex', alignItems: 'center' }}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helper) && (
        <div className="tsf-input-feedback">
          {error && <span className="tsf-input-error">{error}</span>}
          {!error && helper && <span className="tsf-input-helper">{helper}</span>}
        </div>
      )}
    </div>
  );
};

export default Input;