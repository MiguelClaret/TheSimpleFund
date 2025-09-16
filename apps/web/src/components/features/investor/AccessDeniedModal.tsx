import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/useAuth';
import Button from '../../common/Button/Button';

interface AccessDeniedModalProps {
  isOpen: boolean;
}

const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({ isOpen }) => {
  const { user, logout, refreshUser } = useAuth();

  if (!isOpen || user?.status === 'APPROVED') return null;

  const handleUpdateStatus = async () => {
    try {
      await refreshUser();
      toast.success('Status atualizado!');
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente de Aprovação';
      case 'REJECTED':
        return 'Reprovado';
      default:
        return 'Em Análise';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative glass-card max-w-md w-full mx-auto animate-scale-up">
        <div className="text-center p-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-3">
            Aguardando Aprovação
          </h3>
          
          <div className="text-sm text-gray-300 mb-6 space-y-4">
            <p>
              Sua conta de investidor está sendo analisada pela equipe de gestão. 
              Aguarde a aprovação para acessar todas as funcionalidades da plataforma.
            </p>
            
            <div className="glass-card p-4 text-left">
              <h4 className="font-medium text-white mb-3">Status atual:</h4>
              <div className="flex items-center justify-center">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user?.status || '')}`}>
                  {getStatusText(user?.status || '')}
                </span>
              </div>
            </div>
            
            {user?.status === 'REJECTED' && (
              <div className="glass-card p-4 text-left border border-red-400/30">
                <p className="text-red-300 text-sm">
                  <strong>Acesso Negado:</strong> Sua conta foi reprovada. 
                  Entre em contato com o suporte para mais informações.
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-400">
              📧 Em caso de dúvidas, entre em contato: suporte@tsf.com.br
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={handleUpdateStatus}
              className="flex-1"
            >
              Atualizar Status
            </Button>
            <Button
              variant="secondary"
              onClick={logout}
              className="flex-1"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedModal;