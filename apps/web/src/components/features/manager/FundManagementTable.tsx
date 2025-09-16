import React from 'react';
import { 
  CheckIcon, 
  XMarkIcon, 
  ClockIcon, 
  ChartBarIcon,
  CurrencyDollarIcon,
  StopIcon 
} from '@heroicons/react/24/outline';
import { Card } from '../../ui/Card';
import { SuccessButton, DangerButton, SecondaryButton } from '../../ui/Button';

interface Fund {
  id: string;
  name: string;
  description: string | null;
  targetAmount: number | null;
  symbol: string;
  status: string;
  maxSupply: number;
  totalIssued: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  consultor?: {
    email: string;
  };
}

interface FundManagementTableProps {
  funds: Fund[];
  loading?: boolean;
  onApprove: (id: string, action: 'approve' | 'reject') => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
}

const FundManagementTable: React.FC<FundManagementTableProps> = ({
  funds,
  loading = false,
  onApprove,
  onDeactivate
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckIcon className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XMarkIcon className="w-4 h-4 text-red-600" />;
      case 'inactive':
        return <StopIcon className="w-4 h-4 text-gray-600" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
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
        <h3 className="text-lg font-semibold text-gray-900">Fund Management</h3>
        
        {funds.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ChartBarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No funds found</h3>
            <p className="text-gray-500">No funds registered at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {funds.map((fund) => {
              const soldPercentage = (fund.totalIssued / fund.maxSupply) * 100;
              const availableShares = fund.maxSupply - fund.totalIssued;
              
              return (
                <div key={fund.id} className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(fund.status)}
                          <h4 className="text-lg font-semibold text-gray-900">{fund.name}</h4>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fund.status)}`}>
                            {getStatusText(fund.status)}
                          </span>
                        </div>
                        
                        {fund.description && (
                          <p className="text-sm text-gray-600 mb-3">{fund.description}</p>
                        )}
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="text-gray-500">Symbol</div>
                            <div className="text-gray-900 font-medium">{fund.symbol}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-500">Price per share</div>
                            <div className="text-green-600 font-medium">$ {fund.price.toLocaleString('en-US')}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-500">Target</div>
                            <div className="text-gray-900 font-medium">
                              $ {fund.targetAmount?.toLocaleString('en-US') || 'N/A'}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-500">Consultant</div>
                            <div className="text-blue-600 font-medium text-xs">
                              {fund.consultor?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress and Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <ChartBarIcon className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">Issued Shares</span>
                        </div>
                        <div className="text-lg font-semibold text-blue-700">
                          {fund.totalIssued.toLocaleString('en-US')}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">Available</span>
                        </div>
                        <div className="text-lg font-semibold text-green-700">
                          {availableShares.toLocaleString('en-US')}
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <ChartBarIcon className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-purple-600 font-medium">% Sold</span>
                        </div>
                        <div className="text-lg font-semibold text-purple-700">
                          {soldPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-gray-500">
                        Created on {new Date(fund.createdAt).toLocaleDateString('en-US')}
                      </div>
                      
                      <div className="flex space-x-2">
                        {fund.status.toLowerCase() === 'pending' && (
                          <>
                            <SuccessButton
                              size="sm"
                              onClick={() => onApprove(fund.id, 'approve')}
                              icon={<CheckIcon className="w-3 h-3" />}
                            >
                              Approve
                            </SuccessButton>
                            <DangerButton
                              size="sm"
                              onClick={() => onApprove(fund.id, 'reject')}
                              icon={<XMarkIcon className="w-3 h-3" />}
                            >
                              Reject
                            </DangerButton>
                          </>
                        )}
                        
                        {fund.status.toLowerCase() === 'approved' && (
                          <SecondaryButton
                            size="sm"
                            onClick={() => onDeactivate(fund.id)}
                            icon={<StopIcon className="w-3 h-3" />}
                          >
                            Deactivate
                          </SecondaryButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FundManagementTable;