import React from 'react';
import './AuthLayout.css';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  illustration?: React.ReactNode;
  className?: string;
  showLogo?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  illustration,
  className = '',
  showLogo = true,
}) => {
  const layoutClasses = [
    'tsf-auth-layout',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      {/* Background Pattern */}
      <div className="tsf-auth-layout__background">
        <div className="tsf-auth-pattern"></div>
        <div className="tsf-auth-gradient"></div>
      </div>

      {/* Content */}
      <div className="tsf-auth-layout__container">
        {/* Left Side - Form */}
        <div className="tsf-auth-layout__form-side">
          <div className="tsf-auth-layout__form-container">
            {showLogo && (
              <div className="tsf-auth-layout__logo">
                <div className="tsf-logo-auth">
                  <div className="tsf-logo-auth__icon">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="24" cy="24" r="24" fill="url(#auth-logo-gradient)" />
                      <path
                        d="M16 18H32M16 24H32M16 30H24"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="auth-logo-gradient"
                          x1="0"
                          y1="0"
                          x2="48"
                          y2="48"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#764ba2" />
                          <stop offset="1" stopColor="#f0b90b" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="tsf-logo-auth__text">
                    <span className="tsf-logo-auth__primary">THE SIMPLE</span>
                    <span className="tsf-logo-auth__secondary">FUND</span>
                  </div>
                </div>
              </div>
            )}

            {(title || subtitle) && (
              <div className="tsf-auth-layout__header">
                {title && <h1 className="tsf-auth-layout__title">{title}</h1>}
                {subtitle && <p className="tsf-auth-layout__subtitle">{subtitle}</p>}
              </div>
            )}

            <div className="tsf-auth-layout__form">
              {children}
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="tsf-auth-layout__illustration-side">
          <div className="tsf-auth-layout__illustration">
            {illustration || (
              <div className="tsf-auth-default-illustration">
                <div className="tsf-auth-illustration__content">
                  <div className="tsf-auth-illustration__icon">
                    <svg
                      width="120"
                      height="120"
                      viewBox="0 0 120 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="60" cy="60" r="60" fill="url(#illustration-gradient)" opacity="0.1" />
                      <circle cx="60" cy="60" r="40" fill="url(#illustration-gradient)" opacity="0.2" />
                      <circle cx="60" cy="60" r="20" fill="url(#illustration-gradient)" />
                      <defs>
                        <linearGradient
                          id="illustration-gradient"
                          x1="0"
                          y1="0"
                          x2="120"
                          y2="120"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#764ba2" />
                          <stop offset="1" stopColor="#f0b90b" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h2 className="tsf-auth-illustration__title">
                    Tokenize Your Future
                  </h2>
                  <p className="tsf-auth-illustration__description">
                    Join the revolution in decentralized finance with blockchain-powered fund tokenization on the Stellar network.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="tsf-auth-layout__footer">
        <p className="tsf-auth-footer__text">
          © 2025 The Simple Fund. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;