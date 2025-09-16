import React from 'react';
import './Card.css';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  value?: string | number;
  icon?: React.ReactNode;
  highlighted?: boolean;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
  loading?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  value,
  icon,
  highlighted = false,
  onClick,
  className = '',
  hover = true,
  loading = false,
}) => {
  const baseClasses = 'tsf-card';
  const highlightedClasses = highlighted ? 'tsf-card--highlighted' : '';
  const clickableClasses = onClick ? 'tsf-card--clickable' : '';
  const hoverClasses = hover ? 'tsf-card--hover' : '';
  const loadingClasses = loading ? 'tsf-card--loading' : '';

  const classes = [
    baseClasses,
    highlightedClasses,
    clickableClasses,
    hoverClasses,
    loadingClasses,
    className,
  ].filter(Boolean).join(' ');

  const CardContent = () => (
    <>
      {(title || subtitle || value || icon) && (
        <div className="tsf-card__header">
          {icon && <div className="tsf-card__icon">{icon}</div>}
          <div className="tsf-card__header-content">
            {title && <h3 className="tsf-card__title">{title}</h3>}
            {subtitle && <p className="tsf-card__subtitle">{subtitle}</p>}
          </div>
          {value !== undefined && (
            <div className="tsf-card__value">
              <span className="financial-value">{value}</span>
            </div>
          )}
        </div>
      )}
      <div className="tsf-card__content">
        {children}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button className={classes} onClick={onClick}>
        <CardContent />
      </button>
    );
  }

  return (
    <div className={classes}>
      <CardContent />
    </div>
  );
};

export default Card;