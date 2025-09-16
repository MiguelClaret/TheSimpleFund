export const UserRole = {
  INVESTOR: 'investor',
  FUND_MANAGER: 'fundManager',
  CONSULTANT: 'consultant'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRoleType;
  publicKey?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  connectWallet: () => Promise<string>;
}

export interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  network: 'testnet' | 'mainnet';
  balance: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (network: 'testnet' | 'mainnet') => void;
}