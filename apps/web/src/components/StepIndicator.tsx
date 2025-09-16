import React from 'react';

export interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  return (
    <div
      className={`tsf-step-indicator ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 'var(--spacing-md)',
      }}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div
            key={step}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              flex: 1,
            }}
          >
            {/* Step line */}
            {index > 0 && (
              <div
                style={{
                  position: 'absolute',
                  height: '2px',
                  background: isCompleted
                    ? 'var(--highlight)'
                    : 'var(--border-color)',
                  width: '100%',
                  left: '-50%',
                  top: '12px',
                  zIndex: 1,
                  transition: 'background 0.3s ease',
                }}
              />
            )}

            {/* Step circle */}
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isCompleted || isActive
                  ? 'var(--highlight)'
                  : 'var(--background-tertiary)',
                border: isActive
                  ? '2px solid var(--highlight)'
                  : '2px solid var(--border-color)',
                color: isCompleted || isActive
                  ? 'var(--background-primary)'
                  : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                zIndex: 2,
                transition: 'all 0.3s ease',
              }}
            >
              {isCompleted ? (
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
              ) : (
                index + 1
              )}
            </div>

            {/* Step label */}
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                color: isActive
                  ? 'var(--highlight)'
                  : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;