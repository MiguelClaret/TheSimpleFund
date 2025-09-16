import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="tsf-loading-screen">
        <div className="tsf-loading-spinner">
          <div className="tsf-spinner-large"></div>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginTop: 'var(--spacing-lg)',
            fontSize: 'var(--font-size-sm)'
          }}>
            Loading TSF Platform...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="tsf-loading-screen">
        <div className="tsf-loading-spinner">
          <div className="tsf-spinner-large"></div>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginTop: 'var(--spacing-lg)',
            fontSize: 'var(--font-size-sm)'
          }}>
            Loading TSF Platform...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--background-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-lg)',
              },
              success: {
                style: {
                  border: '1px solid var(--success)',
                },
                iconTheme: {
                  primary: 'var(--success)',
                  secondary: 'var(--background-card)',
                },
              },
              error: {
                style: {
                  border: '1px solid var(--error)',
                },
                iconTheme: {
                  primary: 'var(--error)',
                  secondary: 'var(--background-card)',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
