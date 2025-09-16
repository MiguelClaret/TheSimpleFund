import React from 'react';
import { WalletIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { stellarService } from '../../../services/api';
import { useAuth } from '../../../contexts/useAuth';
import Button from '../../common/Button/Button';
import { GlassCard } from '../../common/Card';

interface StellarWalletCardProps {
  stellarKeys: { publicKey: string; secretKey: string } | null;
  onKeysGenerated: (keys: { publicKey: string; secretKey: string }) => void;
}

const StellarWalletCard: React.FC<StellarWalletCardProps> = ({
  stellarKeys,
  onKeysGenerated
}) => {
  const { updateStellarKey } = useAuth();

  const generateStellarKeys = async () => {
    try {
      const response = await stellarService.generateKeys();
      onKeysGenerated(response);
      await updateStellarKey(response.publicKey, response.secretKey);
      toast.success('Chaves Stellar geradas com sucesso!');
    } catch {
      toast.error('Erro ao gerar chaves Stellar');
    }
  };

  const fundAccount = async () => {
    if (!stellarKeys) {
      toast.error('Gere as chaves Stellar primeiro');
      return;
    }

    try {
      await stellarService.fundAccount(stellarKeys.publicKey);
      toast.success('Conta financiada com XLM de teste!');
    } catch {
      toast.error('Erro ao financiar conta');
    }
  };

  if (!stellarKeys) {
    return (
      <GlassCard className="border border-blue-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <WalletIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Configurar Carteira Stellar</h3>
              <p className="text-sm text-gray-300">
                Para investir em fundos tokenizados, você precisa de uma carteira Stellar.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={generateStellarKeys}
            className="flex items-center space-x-2"
          >
            <CpuChipIcon className="w-4 h-4" />
            <span>Gerar Carteira</span>
          </Button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border border-green-400/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <WalletIcon className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-white">Carteira Stellar Configurada</h3>
            <p className="text-sm text-green-300 font-mono truncate">
              {stellarKeys.publicKey}
            </p>
            {/* TODO: Implementar carregamento de saldos de tokens
            <div className="mt-2">
              <h4 className="text-sm font-medium text-green-300">Saldos de Tokens:</h4>
              <div className="flex space-x-4 mt-1">
                <span className="text-sm text-green-400">Funcionalidade em desenvolvimento</span>
              </div>
            </div>
            */}
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={fundAccount}
          className="flex items-center space-x-2 bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30"
        >
          <CpuChipIcon className="w-4 h-4" />
          <span>Financiar (Testnet)</span>
        </Button>
      </div>
    </GlassCard>
  );
};

export default StellarWalletCard;