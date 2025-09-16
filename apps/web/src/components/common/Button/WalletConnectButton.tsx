import React from 'react';
import { motion } from 'framer-motion';
import { WalletIcon } from '@heroicons/react/24/outline';

interface WalletConnectButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  publicKey?: string;
  network: 'testnet' | 'mainnet';
  balance?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  isConnected,
  isConnecting,
  publicKey,
  network,
  balance,
  onConnect,
  onDisconnect,
  className = ''
}) => {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && publicKey) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Network Indicator */}
        <div className={`network-indicator ${network === 'testnet' ? 'network-testnet' : 'network-mainnet'}`}>
          {network}
        </div>

        {/* Wallet Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card px-4 py-2 flex items-center space-x-3"
        >
          <WalletIcon className="w-5 h-5 text-green-400" />
          <div className="text-sm">
            <div className="text-white font-medium">
              {truncateAddress(publicKey)}
            </div>
            {balance && (
              <div className="text-white/60 text-xs">
                {parseFloat(balance).toFixed(2)} XLM
              </div>
            )}
          </div>
          <button
            onClick={onDisconnect}
            className="text-white/60 hover:text-white text-xs px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
          >
            Disconnect
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.button
      onClick={onConnect}
      disabled={isConnecting}
      className={`
        btn-secondary flex items-center space-x-2
        ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={!isConnecting ? { scale: 1.02 } : undefined}
      whileTap={!isConnecting ? { scale: 0.98 } : undefined}
    >
      {isConnecting ? (
        <>
          <div className="spinner w-4 h-4" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <WalletIcon className="w-5 h-5" />
          <span>Connect Wallet</span>
        </>
      )}
    </motion.button>
  );
};

export default WalletConnectButton;