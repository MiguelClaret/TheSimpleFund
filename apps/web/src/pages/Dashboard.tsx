import React from 'react';
import { useAuth } from '../contexts/useAuth';
import ConsultorDashboard from './ConsultorDashboard';
import GestorDashboard from './GestorDashboard';
import InvestidorDashboard from './InvestidorDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="tsf-loading-screen">
        <div className="tsf-loading-content">
          <div className="tsf-loading-spinner">
            <div className="tsf-spinner-large"></div>
          </div>
          <p>Carregando painel...</p>
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
        <div className="tsf-loading-screen">
          <div className="tsf-loading-content">
            <h2 className="tsf-text-xl">Acesso não autorizado</h2>
            <p>Tipo de usuário não reconhecido.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;