import React from 'react';
import './Form.css';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helper,
  placeholder,
  options,
  className = '',
  ...props
}) => {
  const baseClasses = 'tsf-select';
  const errorClasses = error ? 'tsf-select--error' : '';

  const selectClasses = [
    baseClasses,
    errorClasses,
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
      
      <div className="tsf-select-container">
        <select className={selectClasses} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="tsf-select-icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
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

export default Select;