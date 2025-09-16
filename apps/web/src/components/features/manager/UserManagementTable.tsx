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
        return <CheckIcon className="w-4 h-4 text-green-300" />;
      case 'rejected':
        return <XMarkIcon className="w-4 h-4 text-red-300" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-300" />;
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
        return 'bg-green-500/30 text-green-300 border-green-400/40';
      case 'rejected':
        return 'bg-red-500/30 text-red-300 border-red-400/40';
      default:
        return 'bg-yellow-500/30 text-yellow-300 border-yellow-400/40';
    }
  };

  if (loading) {
    return (
      <GlassCard className="bg-white/10 backdrop-blur-xl border-white/20">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="bg-white/10 backdrop-blur-xl border-white/20">
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        
        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-400/30 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
            <p className="text-gray-200">No users registered in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white/10 border border-white/20 rounded-lg p-4 hover:scale-[1.01] transition-transform backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(user.status)}
                      <h4 className="font-medium text-white">{user.email}</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-200">
                      <div>
                        <span className="text-gray-300">Profile:</span> {user.role}
                      </div>
                      <div>
                        <span className="text-gray-300">Registered:</span>{' '}
                        {new Date(user.createdAt).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </div>
                  
                  {user.status.toLowerCase() === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="secondary"
                        onClick={() => onApprove(user.id, 'approve')}
                        className="bg-green-500/30 border-green-400/40 text-green-200 hover:bg-green-500/40 hover:text-green-100"
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => onApprove(user.id, 'reject')}
                        className="bg-red-500/30 border-red-400/40 text-red-200 hover:bg-red-500/40 hover:text-red-100"
                      >
                        <XMarkIcon className="w-4 h-4 mr-1" />
                        Reject
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