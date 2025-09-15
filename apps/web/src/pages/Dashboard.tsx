import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ConsultorDashboard from './ConsultorDashboard';
import GestorDashboard from './GestorDashboard';
import InvestidorDashboard from './InvestidorDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  switch (user.role.toLowerCase()) {
    case 'consultor':
      return <ConsultorDashboard />;
    case 'gestor':
      return <GestorDashboard />;
    case 'investidor':
      return <InvestidorDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Acesso não autorizado</h2>
            <p className="mt-2 text-gray-600">Tipo de usuário não reconhecido.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;