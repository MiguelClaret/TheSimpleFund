import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldExclamationIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/useAuth';
import ConsultorDashboard from './ConsultorDashboard';
import GestorDashboard from './GestorDashboard';
import InvestidorDashboard from './InvestidorDashboard';
import { GlassCard } from '../components/common/Card';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulate initialization delay for better UX
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Loading state with TSF design
  if (authLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        {/* Background Effects */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <GlassCard>
            <div className="text-center space-y-6 p-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto"
              >
                <div className="w-full h-full border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"></div>
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Carregando Dashboard
                </h2>
                <p className="text-gray-400">
                  Preparando sua experiência...
                </p>
              </div>
              
              {/* Loading dots animation */}
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <GlassCard>
            <div className="text-center space-y-6 p-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <ShieldExclamationIcon className="w-8 h-8 text-red-400" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">
                  Acesso Necessário
                </h2>
                <p className="text-gray-400">
                  Você precisa estar logado para acessar o dashboard.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // Role-based dashboard rendering
  const renderDashboard = () => {
    const roleKey = user.role.toLowerCase();
    
    switch (roleKey) {
      case 'consultor':
        return <ConsultorDashboard />;
      case 'gestor':
        return <GestorDashboard />;
      case 'investidor':
        return <InvestidorDashboard />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="fixed inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <GlassCard>
                <div className="text-center space-y-6 p-8">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">
                      Acesso Não Autorizado
                    </h2>
                    <p className="text-gray-400">
                      Tipo de usuário não reconhecido: <span className="text-yellow-400 font-mono">{user.role}</span>
                    </p>
                  </div>
                  
                  <div className="glass-card p-4 border border-yellow-400/30">
                    <p className="text-sm text-yellow-300">
                      <strong>Roles válidos:</strong> Consultor, Gestor, Investidor
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={user.role}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderDashboard()}
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;