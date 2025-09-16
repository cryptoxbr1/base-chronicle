import { createConfig, http } from 'wagmi';
import { base, baseSepolia, hardhat } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

// WalletConnect project ID (get from https://cloud.walletconnect.com)
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

export const config = createConfig({
  chains: [base, baseSepolia, hardhat],
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'BaseLine',
      appLogoUrl: '/baseline-logo.png'
    }),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'BaseLine',
        description: 'A Web3 microblogging platform on Base',
        url: 'https://baseline.app',
        icons: ['/baseline-logo.png']
      } 
    }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
});

export const SUPPORTED_CHAINS = [base, baseSepolia, hardhat];
export const DEFAULT_CHAIN = base;