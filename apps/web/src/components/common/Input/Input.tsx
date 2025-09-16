import React from 'react';
import './Input.css';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
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
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
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
  onChange,
  onFocus,
  onBlur,
}) => {
  const inputClasses = `
    tsf-input
    ${error ? 'tsf-input--error' : ''}
    ${disabled ? 'tsf-input--disabled' : ''}
    ${className}
  `.trim();

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="tsf-input-wrapper">
      {label && (
        <label className="tsf-input-label">
          {label}
          {required && <span className="tsf-input-required">*</span>}
        </label>
      )}
      
      <InputComponent
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
      />
      
      {error && <div className="tsf-input-error">{error}</div>}
      {helperText && !error && <div className="tsf-input-helper">{helperText}</div>}
    </div>
  );
};

export default Input;