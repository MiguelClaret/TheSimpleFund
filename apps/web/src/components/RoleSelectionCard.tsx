import React from 'react';
import './RoleSelectionCard.css';

export interface RoleSelectionCardProps {
  role: 'investor' | 'gestorFundo' | 'consultor';
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  isSelected?: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  role,
  icon,
  title,
  description,
  features,
  isSelected = false,
  onClick,
  className = '',
  disabled = false,
  style = {},
}) => {
  const cardClasses = [
    'tsf-role-selection-card',
    `tsf-role-selection-card--${role}`,
    isSelected ? 'tsf-role-selection-card--selected' : '',
    disabled ? 'tsf-role-selection-card--disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div className={cardClasses} onClick={handleClick} style={style}>
      {isSelected && (
        <div className="tsf-role-selection-card__selected-indicator">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 4.5L6 12L2.5 8.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      
      <div className="tsf-role-selection-card__icon">
        {icon}
      </div>

      <div className="tsf-role-selection-card__content">
        <h3 className="tsf-role-selection-card__title">{title}</h3>
        <p className="tsf-role-selection-card__description">{description}</p>

        {features.length > 0 && (
          <div className="tsf-role-selection-card__features">
            <h4 className="tsf-role-selection-card__features-title">
              Key Features:
            </h4>
            <ul className="tsf-role-selection-card__features-list">
              {features.map((feature, index) => (
                <li key={index} className="tsf-role-selection-card__feature">
                  <span className="tsf-role-selection-card__feature-icon">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="tsf-role-selection-card__footer">
        <div className="tsf-role-selection-card__action">
          {isSelected ? (
            <span className="tsf-role-selection-card__selected-text">
              Selected
            </span>
          ) : (
            <span className="tsf-role-selection-card__select-text">
              Select
            </span>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="tsf-role-selection-card__overlay"></div>
    </div>
  );
};

export default RoleSelectionCard;