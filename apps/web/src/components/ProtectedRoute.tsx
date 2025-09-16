import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Você não está autenticado.</div>
      </div>
    );
  }

  // Se o usuário está rejeitado, o modal será exibido pelo AuthContext
  // mas ainda renderizamos o conteúdo para que o usuário veja o modal
  if (user.status === 'REJECTED') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Acesso negado.</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;