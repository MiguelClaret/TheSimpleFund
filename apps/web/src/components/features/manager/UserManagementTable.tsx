import React from 'react';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '../../common/Card';
import Button from '../../common/Button/Button';

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface UserManagementTableProps {
  users: User[];
  title: string;
  loading?: boolean;
  onApprove: (id: string, action: 'approve' | 'reject') => Promise<void>;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  title,
  loading = false,
  onApprove
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckIcon className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XMarkIcon className="w-4 h-4 text-red-400" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-400/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
    }
  };

  if (loading) {
    return (
      <GlassCard>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        
        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-400">Não há usuários cadastrados nesta categoria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="glass-card p-4 hover:scale-[1.01] transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(user.status)}
                      <h4 className="font-medium text-white">{user.email}</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-400">Perfil:</span> {user.role}
                      </div>
                      <div>
                        <span className="text-gray-400">Cadastrado em:</span>{' '}
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  {user.status.toLowerCase() === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="secondary"
                        onClick={() => onApprove(user.id, 'approve')}
                        className="bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30"
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => onApprove(user.id, 'reject')}
                        className="bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
                      >
                        <XMarkIcon className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default UserManagementTable;