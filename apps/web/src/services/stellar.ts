// Stellar Network Configuration
export const STELLAR_NETWORKS = {
  testnet: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    name: 'Testnet'
  },
  mainnet: {
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    horizonUrl: 'https://horizon.stellar.org',
    name: 'Mainnet'
  }
} as const;

export type StellarNetwork = keyof typeof STELLAR_NETWORKS;

// Freighter Wallet Integration
export interface FreighterAPI {
  isConnected(): Promise<boolean>;
  getPublicKey(): Promise<string>;
  signTransaction(xdr: string, networkPassphrase: string): Promise<string>;
  isAllowed(): Promise<boolean>;
  setAllowed(): Promise<void>;
}

declare global {
  interface Window {
    freighter?: FreighterAPI;
  }
}

class StellarService {
  private network: StellarNetwork = 'testnet';

  setNetwork(network: StellarNetwork) {
    this.network = network;
  }

  getNetwork() {
    return this.network;
  }

  getNetworkConfig() {
    return STELLAR_NETWORKS[this.network];
  }

  async isFreighterAvailable(): Promise<boolean> {
    return typeof window !== 'undefined' && !!window.freighter;
  }

  async connectWallet(): Promise<string> {
    if (!await this.isFreighterAvailable()) {
      throw new Error('Freighter wallet not found. Please install Freighter extension.');
    }

    const freighter = window.freighter!;
    
    // Check if already connected
    if (await freighter.isConnected()) {
      return await freighter.getPublicKey();
    }

    // Request connection
    await freighter.setAllowed();
    
    if (await freighter.isConnected()) {
      return await freighter.getPublicKey();
    }

    throw new Error('Failed to connect to Freighter wallet.');
  }

  async getPublicKey(): Promise<string | null> {
    if (!await this.isFreighterAvailable()) {
      return null;
    }

    const freighter = window.freighter!;
    
    if (await freighter.isConnected()) {
      return await freighter.getPublicKey();
    }

    return null;
  }

  async isWalletConnected(): Promise<boolean> {
    if (!await this.isFreighterAvailable()) {
      return false;
    }

    return await window.freighter!.isConnected();
  }

  async getAccountBalance(publicKey: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.getNetworkConfig().horizonUrl}/accounts/${publicKey}`
      );
      
      if (!response.ok) {
        throw new Error('Account not found');
      }

      const account = await response.json();
      const xlmBalance = account.balances.find(
        (balance: any) => balance.asset_type === 'native'
      );

      return xlmBalance ? xlmBalance.balance : '0';
    } catch (error) {
      console.error('Error fetching account balance:', error);
      return '0';
    }
  }

  async signTransaction(xdr: string): Promise<string> {
    if (!await this.isFreighterAvailable()) {
      throw new Error('Freighter wallet not available');
    }

    const freighter = window.freighter!;
    const networkPassphrase = this.getNetworkConfig().networkPassphrase;

    return await freighter.signTransaction(xdr, networkPassphrase);
  }

  // Helper method to create trustline for tokens
  async createTrustline(assetCode: string, issuerPublicKey: string): Promise<string> {
    // This would integrate with Stellar SDK to create trustline transaction
    // Implementation would depend on the specific requirements
    console.log('Creating trustline for:', assetCode, 'from issuer:', issuerPublicKey);
    throw new Error('Trustline creation not implemented yet');
  }

  // Helper method to get account assets
  async getAccountAssets(publicKey: string): Promise<unknown[]> {
    try {
      const response = await fetch(
        `${this.getNetworkConfig().horizonUrl}/accounts/${publicKey}`
      );
      
      if (!response.ok) {
        throw new Error('Account not found');
      }

      const account = await response.json();
      return account.balances || [];
    } catch (error) {
      console.error('Error fetching account assets:', error);
      return [];
    }
  }
}

export const stellarService = new StellarService();
export default stellarService;