import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../contexts/useAuth';
import Button from '../Button/Button';
import './UserProfile.css';

export interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getRoleDisplayName = (role: string) => {
    switch (role.toLowerCase()) {
      case 'gestor':
        return 'Gestor';
      case 'consultor':
        return 'Consultor';
      case 'investidor':
        return 'Investidor';
      default:
        return role;
    }
  };

  return (
    <div className={`tsf-user-profile ${className}`} ref={dropdownRef}>
      <button
        className="tsf-user-profile__trigger"
        onClick={toggleDropdown}
        aria-label="User menu"
      >
        <div className="tsf-user-profile__avatar">
          {getInitials(user.email)}
        </div>
        <div className="tsf-user-profile__info">
          <span className="tsf-user-profile__email">{user.email}</span>
          <span className="tsf-user-profile__role">{getRoleDisplayName(user.role)}</span>
        </div>
        <svg
          className={`tsf-user-profile__chevron ${isDropdownOpen ? 'tsf-user-profile__chevron--open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="tsf-user-profile__dropdown">
          <div className="tsf-user-profile__dropdown-header">
            <div className="tsf-user-profile__dropdown-avatar">
              {getInitials(user.email)}
            </div>
            <div className="tsf-user-profile__dropdown-info">
              <p className="tsf-user-profile__dropdown-email">{user.email}</p>
              <p className="tsf-user-profile__dropdown-role">{getRoleDisplayName(user.role)}</p>
              {user.status && (
                <span className={`tsf-user-profile__status tsf-user-profile__status--${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              )}
            </div>
          </div>

          <div className="tsf-user-profile__dropdown-divider" />

          <div className="tsf-user-profile__dropdown-actions">

            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={handleLogout}
              className="tsf-user-profile__dropdown-action tsf-user-profile__logout"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.3333 11.3333L14 8.66667L11.3333 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 8.66667H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sair
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;