import React, { useState } from 'react';
import Button from '../Button';
import UserProfile from '../UserProfile';
import { useAuth } from '../../../contexts/useAuth';
import './Navigation.css';

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: React.ReactNode;
}

export interface NavigationHeaderProps {
  navigation: NavigationItem[];
  onHelpClick?: () => void;
  className?: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  navigation,
  onHelpClick,
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`tsf-navigation ${className}`}>
      <div className="tsf-navigation__container">
        {/* Logo */}
        <div className="tsf-navigation__logo">
          <a href="/" className="tsf-logo">
            <div className="tsf-logo__icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="16" fill="url(#logo-gradient)" />
                <path
                  d="M10 12H22M10 16H22M10 20H16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="logo-gradient"
                    x1="0"
                    y1="0"
                    x2="32"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#764ba2" />
                    <stop offset="1" stopColor="#f0b90b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="tsf-logo__text">
              <span className="tsf-logo__primary">THE SIMPLE</span>
              <span className="tsf-logo__secondary">FUND</span>
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="tsf-navigation__menu">
          {navigation.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`tsf-navigation__link ${
                item.active ? 'tsf-navigation__link--active' : ''
              }`}
            >
              {item.icon && (
                <span className="tsf-navigation__link-icon">{item.icon}</span>
              )}
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="tsf-navigation__actions">
          {user && <UserProfile />}
          
          {onHelpClick && !user && (
            <Button
              variant="outline"
              size="sm"
              onClick={onHelpClick}
              className="tsf-navigation__help-btn"
            >
              Need Help?
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="tsf-navigation__mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`tsf-hamburger ${isMobileMenuOpen ? 'tsf-hamburger--open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`tsf-navigation__mobile ${isMobileMenuOpen ? 'tsf-navigation__mobile--open' : ''}`}>
        <nav className="tsf-navigation__mobile-menu">
          {navigation.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`tsf-navigation__mobile-link ${
                item.active ? 'tsf-navigation__mobile-link--active' : ''
              }`}
              onClick={closeMobileMenu}
            >
              {item.icon && (
                <span className="tsf-navigation__link-icon">{item.icon}</span>
              )}
              {item.label}
            </a>
          ))}
          
          {onHelpClick && (
            <div className="tsf-navigation__mobile-actions">
              <Button
                variant="outline"
                onClick={() => {
                  onHelpClick();
                  closeMobileMenu();
                }}
                className="w-full"
              >
                Need Help?
              </Button>
            </div>
          )}

          {user && (
            <div className="tsf-navigation__mobile-user">
              <UserProfile />
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="tsf-navigation__overlay"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
};

export default NavigationHeader;