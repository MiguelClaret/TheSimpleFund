import React from 'react';
import { useAuth } from '../contexts/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">You are not authenticated.</div>
      </div>
    );
  }

  // Se o usuário está rejeitado, o modal será exibido pelo AuthContext
  // mas ainda renderizamos o conteúdo para que o usuário veja o modal
  if (user.status === 'REJECTED') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Access Denied</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;