import React from 'react';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({ 
  isOpen, 
  onClose, 
  userRole 
}) => {
  if (!isOpen) return null;

  const getMessage = () => {
    if (userRole === 'CONSULTOR') {
      return {
        title: 'Acesso Negado',
        message: 'Sua solicitação para se tornar consultor foi rejeitada. Entre em contato com o suporte para mais informações.',
        icon: '❌'
      };
    } else if (userRole === 'INVESTIDOR') {
      return {
        title: 'Acesso Negado',
        message: 'Sua conta foi rejeitada pelo administrador. Entre em contato com o suporte para mais informações.',
        icon: '❌'
      };
    } else {
      return {
        title: 'Acesso Negado',
        message: 'Sua conta foi rejeitada. Entre em contato com o suporte para mais informações.',
        icon: '❌'
      };
    }
  };

  const { title, message, icon } = getMessage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="text-center">
          <div className="text-4xl mb-4">{icon}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Entendi
            </button>
            <a
              href="mailto:suporte@verosolutions.com"
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors text-center"
            >
              Entrar em Contato com Suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedModal;