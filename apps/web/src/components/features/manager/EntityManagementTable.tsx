import React from 'react';
import { CheckIcon, XMarkIcon, ClockIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Card } from '../../ui/Card';
import { SuccessButton, DangerButton } from '../../ui/Button';

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
      <Card className="p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        {entities.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No entities found</h3>
            <p className="text-gray-500">No entities registered in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entities.map((entity) => (
              <div key={entity.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(entity.status)}
                      <h4 className="font-medium text-gray-900">{entity.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entity.status)}`}>
                        {getStatusText(entity.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      {entity.document && (
                        <div>
                          <span className="font-medium">CPF/CNPJ:</span> {entity.document}
                        </div>
                      )}
                      {entity.cnpj && (
                        <div>
                          <span className="font-medium">CNPJ:</span> {entity.cnpj}
                        </div>
                      )}
                      {entity.consultor && (
                        <div>
                          <span className="font-medium">Consultant:</span>{' '}
                          <span className="text-blue-600">{entity.consultor.email}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Registered on:</span>{' '}
                        {new Date(entity.createdAt).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </div>
                  
                  {entity.status.toLowerCase() === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <SuccessButton
                        size="sm"
                        onClick={() => onApprove(entity.id, 'approve')}
                        icon={<CheckIcon className="w-3 h-3" />}
                      >
                        Approve
                      </SuccessButton>
                      <DangerButton
                        size="sm"
                        onClick={() => onApprove(entity.id, 'reject')}
                        icon={<XMarkIcon className="w-3 h-3" />}
                      >
                        Reject
                      </DangerButton>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EntityManagementTable;