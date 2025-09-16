import React from 'react';
import { CheckIcon, XMarkIcon, ClockIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '../../common/Card';
import Button from '../../common/Button/Button';

interface Entity {
  id: number;
  name: string;
  document?: string;
  cnpj?: string;
  status: string;
  createdAt: string;
  consultor?: {
    email: string;
  };
}

interface EntityManagementTableProps {
  entities: Entity[];
  title: string;
  loading?: boolean;
  onApprove: (id: number, action: 'approve' | 'reject') => Promise<void>;
}

const EntityManagementTable: React.FC<EntityManagementTableProps> = ({
  entities,
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
        
        {entities.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mb-4">
              <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nenhuma entidade encontrada</h3>
            <p className="text-gray-400">Não há entidades cadastradas nesta categoria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entities.map((entity) => (
              <div key={entity.id} className="glass-card p-4 hover:scale-[1.01] transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(entity.status)}
                      <h4 className="font-medium text-white">{entity.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(entity.status)}`}>
                        {getStatusText(entity.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-300">
                      {entity.document && (
                        <div>
                          <span className="text-gray-400">CPF/CNPJ:</span> {entity.document}
                        </div>
                      )}
                      {entity.cnpj && (
                        <div>
                          <span className="text-gray-400">CNPJ:</span> {entity.cnpj}
                        </div>
                      )}
                      {entity.consultor && (
                        <div>
                          <span className="text-gray-400">Consultor:</span>{' '}
                          <span className="text-blue-400">{entity.consultor.email}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Cadastrado em:</span>{' '}
                        {new Date(entity.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  {entity.status.toLowerCase() === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="secondary"
                        onClick={() => onApprove(entity.id, 'approve')}
                        className="bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30"
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => onApprove(entity.id, 'reject')}
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

export default EntityManagementTable;