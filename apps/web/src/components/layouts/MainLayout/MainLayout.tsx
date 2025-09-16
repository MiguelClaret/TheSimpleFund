import React from 'react';
import NavigationHeader from '../../common/Navigation';
import type { NavigationItem } from '../../common/Navigation';
import './MainLayout.css';

export interface MainLayoutProps {
  children: React.ReactNode;
  navigation?: NavigationItem[];
  showNavigation?: boolean;
  onHelpClick?: () => void;
  className?: string;
}

const defaultNavigation: NavigationItem[] = [
  {
    label: 'Markets',
    href: '#markets',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M1 8L3 6L6 9L9 4L15 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'About',
    href: '#about',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M6.12 6C6.38484 5.33481 7.18095 5 8 5C9.10457 5 10 5.89543 10 7C10 8.10457 9.10457 9 8 9C6.89543 9 6 9.89543 6 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="8" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  navigation = defaultNavigation,
  showNavigation = true,
  onHelpClick,
  className = '',
}) => {
  const layoutClasses = [
    'tsf-main-layout',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      {showNavigation && (
        <NavigationHeader
          navigation={navigation}
          onHelpClick={onHelpClick}
        />
      )}
      
      <main className="tsf-main-layout__content">
        <div className="tsf-main-layout__container">
          {children}
        </div>
      </main>
      
      <footer className="tsf-main-layout__footer">
        <div className="tsf-main-layout__footer-content">
          <div className="tsf-footer__brand">
            <span className="tsf-footer__logo">TSF</span>
            <span className="tsf-footer__tagline">
              Tokenizing the future of finance
            </span>
          </div>
          
          <div className="tsf-footer__links">
            <a href="/privacy" className="tsf-footer__link">Privacy</a>
            <a href="/terms" className="tsf-footer__link">Terms</a>
            <a href="/security" className="tsf-footer__link">Security</a>
          </div>
          
          <div className="tsf-footer__social">
            <a href="#" className="tsf-footer__social-link" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 4.01C21.2 4.35 20.33 4.58 19.42 4.69C20.35 4.13 21.05 3.24 21.38 2.18C20.51 2.69 19.55 3.06 18.54 3.27C17.73 2.39 16.59 1.85 15.34 1.85C12.94 1.85 11.01 3.78 11.01 6.18C11.01 6.51 11.05 6.83 11.12 7.14C7.69 6.95 4.68 5.22 2.74 2.61C2.38 3.34 2.18 4.13 2.18 4.96C2.18 6.54 2.99 7.94 4.25 8.75C3.51 8.72 2.81 8.54 2.19 8.24V8.3C2.19 10.39 3.69 12.13 5.66 12.52C5.31 12.61 4.95 12.66 4.58 12.66C4.32 12.66 4.07 12.64 3.83 12.59C4.33 14.3 5.94 15.56 7.84 15.59C6.35 16.74 4.5 17.42 2.5 17.42C2.16 17.42 1.83 17.4 1.5 17.37C3.42 18.6 5.75 19.3 8.25 19.3C15.33 19.3 19.21 12.72 19.21 6.68L19.2 6.14C20.08 5.5 20.84 4.71 21.42 3.82L22 4.01Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a href="#" className="tsf-footer__social-link" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C20.565 21.795 24 17.295 24 12C24 5.37 18.63 0 12 0Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="tsf-footer__bottom">
          <p className="tsf-footer__copyright">
            © 2025 The Simple Fund. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;