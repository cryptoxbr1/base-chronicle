import { createConfig, http } from 'wagmi';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia, hardhat } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect, okxWallet } from 'wagmi/connectors';

const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined;
const baseRpc = (import.meta.env.VITE_BASE_RPC as string | undefined) ?? 'https://mainnet.base.org';

const connectors = [
  metaMask(),
  coinbaseWallet({
    appName: 'BaseLine',
    appLogoUrl: '/baseline-logo.png',
  }),
  // OKX Wallet connector (if available in the environment)
  okxWallet ? okxWallet() : undefined,
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          metadata: {
            name: 'BaseLine',
            description: 'A Web3 microblogging platform on Base',
            url: 'https://baseline.app',
            icons: ['/baseline-logo.png'],
          },
        }),
      ]
    : []),
];

export const config = createConfig({
  chains: [base, baseSepolia, hardhat],
  connectors,
  transports: {
    [base.id]: http(baseRpc),
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
});

export const SUPPORTED_CHAINS = [base, baseSepolia, hardhat];
export const DEFAULT_CHAIN = base;
