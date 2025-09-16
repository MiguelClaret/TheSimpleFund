import React, { useState } from 'react';
import NavigationHeader from '../../common/Navigation';
import type { NavigationItem } from '../../common/Navigation';
import './DashboardLayout.css';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  navigation?: NavigationItem[];
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  onHelpClick?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const defaultNavigation: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    active: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 3C2 2.44772 2.44772 2 3 2H7C7.55228 2 8 2.44772 8 3V7C8 7.55228 7.55228 8 7 8H3C2.44772 8 2 7.55228 2 7V3Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5C14 5.55228 13.5523 6 13 6H11C10.4477 6 10 5.55228 10 5V3Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M2 11C2 10.4477 2.44772 10 3 10H7C7.55228 10 8 10.4477 8 11V13C8 13.5523 7.55228 14 7 14H3C2.44772 14 2 13.5523 2 13V11Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M10 9C10 8.44772 10.4477 8 11 8H13C13.5523 8 14 8.44772 14 9V13C14 13.5523 13.5523 14 13 14H11C10.4477 14 10 13.5523 10 13V9Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  navigation = defaultNavigation,
  sidebar,
  showSidebar = false,
  sidebarCollapsed = false,
  onSidebarToggle,
  onHelpClick,
  className = '',
  title,
  subtitle,
  actions,
}) => {
  const [internalSidebarCollapsed, setInternalSidebarCollapsed] = useState(sidebarCollapsed);

  const handleSidebarToggle = () => {
    if (onSidebarToggle) {
      onSidebarToggle();
    } else {
      setInternalSidebarCollapsed(!internalSidebarCollapsed);
    }
  };

  const isCollapsed = onSidebarToggle ? sidebarCollapsed : internalSidebarCollapsed;

  const layoutClasses = [
    'tsf-dashboard-layout',
    showSidebar ? 'tsf-dashboard-layout--with-sidebar' : '',
    isCollapsed ? 'tsf-dashboard-layout--sidebar-collapsed' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      <NavigationHeader
        navigation={navigation}
        onHelpClick={onHelpClick}
      />

      <div className="tsf-dashboard-layout__container">
        {/* Sidebar */}
        {showSidebar && sidebar && (
          <>
            <aside className={`tsf-dashboard-layout__sidebar ${
              isCollapsed ? 'tsf-dashboard-layout__sidebar--collapsed' : ''
            }`}>
              <div className="tsf-dashboard-layout__sidebar-header">
                <button
                  className="tsf-dashboard-layout__sidebar-toggle"
                  onClick={handleSidebarToggle}
                  aria-label="Toggle sidebar"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`tsf-sidebar-toggle-icon ${
                      isCollapsed ? 'tsf-sidebar-toggle-icon--collapsed' : ''
                    }`}
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="tsf-dashboard-layout__sidebar-content">
                {sidebar}
              </div>
            </aside>

            {/* Sidebar Overlay for Mobile */}
            {!isCollapsed && (
              <div
                className="tsf-dashboard-layout__sidebar-overlay"
                onClick={handleSidebarToggle}
              />
            )}
          </>
        )}

        {/* Main Content */}
        <main className="tsf-dashboard-layout__main">
          {(title || subtitle || actions) && (
            <div className="tsf-dashboard-layout__header">
              <div className="tsf-dashboard-layout__header-content">
                {title && <h1 className="tsf-dashboard-layout__title">{title}</h1>}
                {subtitle && <p className="tsf-dashboard-layout__subtitle">{subtitle}</p>}
              </div>
              {actions && (
                <div className="tsf-dashboard-layout__actions">
                  {actions}
                </div>
              )}
            </div>
          )}

          <div className="tsf-dashboard-layout__content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;