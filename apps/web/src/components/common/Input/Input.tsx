import React from 'react';
import './Input.css';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  step?: string;
  rows?: number;
  multiline?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  id,
  name,
  value,
  placeholder,
  label,
  required,
  disabled,
  error,
  helperText,
  step,
  rows = 3,
  multiline = false,
  className = '',
  leftIcon,
  rightIcon,
  onChange,
  onFocus,
  onBlur,
}) => {
  const inputClasses = `
    tsf-input
    ${error ? 'tsf-input--error' : ''}
    ${disabled ? 'tsf-input--disabled' : ''}
    ${leftIcon ? 'tsf-input--with-left-icon' : ''}
    ${rightIcon ? 'tsf-input--with-right-icon' : ''}
    ${className}
  `.trim();

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="tsf-input-wrapper">
      {label && (
        <label htmlFor={id} className="tsf-input-label">
          {label}
          {required && <span className="tsf-input-required">*</span>}
        </label>
      )}
      
      <div className="tsf-input-container">
        {leftIcon && (
          <div className="tsf-input-icon tsf-input-icon--left">
            {leftIcon}
          </div>
        )}
        
        <InputComponent
          id={id}
          {...(multiline ? { rows } : { type, step })}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{ color: 'white' }} // Ensure text is visible in dark mode
        />
        
        {rightIcon && (
          <div className="tsf-input-icon tsf-input-icon--right">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && <div className="tsf-input-error">{error}</div>}
      {helperText && !error && <div className="tsf-input-helper">{helperText}</div>}
    </div>
  );
};

export default Input;