import React from 'react';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Card } from '../../ui/Card';
import { SuccessButton, DangerButton } from '../../ui/Button';

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
        return <CheckIcon className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XMarkIcon className="w-4 h-4 text-red-600" />;
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
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">No users registered in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(user.status)}
                      <h4 className="font-medium text-gray-900">{user.email}</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Profile:</span> {user.role}
                      </div>
                      <div>
                        <span className="font-medium">Registered:</span>{' '}
                        {new Date(user.createdAt).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </div>
                  
                  {user.status.toLowerCase() === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <SuccessButton
                        size="sm"
                        onClick={() => onApprove(user.id, 'approve')}
                        icon={<CheckIcon className="w-3 h-3" />}
                      >
                        Approve
                      </SuccessButton>
                      <DangerButton
                        size="sm"
                        onClick={() => onApprove(user.id, 'reject')}
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

export default UserManagementTable;