import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useConnect, useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Wallet, Shield, Zap, ChevronRight } from "lucide-react";
import { base } from 'wagmi/chains';
import { useEffect } from "react";
import heroImage from "@/assets/baseline-hero.jpg";

interface ConnectWalletProps {
  onConnect: () => void;
}

const ConnectWallet = ({ onConnect }: ConnectWalletProps) => {
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const baseRpc = (import.meta.env.VITE_BASE_RPC as string | undefined) ?? 'https://mainnet.base.org';

  useEffect(() => {
    if (isConnected) {
      onConnect();
    }
  }, [isConnected, onConnect]);

  useEffect(() => {
    if (!isConnected) return;

    const ensureBase = async () => {
      if (chain?.id === base.id) return;
      try {
        if (switchNetwork) {
          switchNetwork(base.id);
          return;
        }

        const ethereum = (window as any).ethereum;
        if (!ethereum?.request) {
          try { (await import('sonner')).toast.error('No Ethereum provider available to switch networks'); } catch { /* ignore */ }
          return;
        }

        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x' + base.id.toString(16),
            chainName: 'Base Mainnet',
            rpcUrls: [baseRpc],
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://base.blockscout.com/'],
          }],
        });

        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + base.id.toString(16) }],
        });

        try { (await import('sonner')).toast.success('Switched to Base Mainnet'); } catch { /* ignore */ }
      } catch (err) {
        console.error('Network switch failed', err);
        try { (await import('sonner')).toast.error('Please switch your wallet to Base Mainnet'); } catch { /* ignore */ }
      }
    };

    ensureBase();
  }, [isConnected, chain?.id, switchNetwork, baseRpc]);

  const wallets = [];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg animate-bounce-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-medium">
              <span className="text-3xl font-bold text-primary-foreground">B</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome to <span className="gradient-text">BaseLine</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              The future of on-chain social networking on Base
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: Shield, label: "Fully On-Chain", desc: "No servers, pure Web3" },
              { icon: Zap, label: "Base Native", desc: "Built for Base L2" },
              { icon: Wallet, label: "NFT Avatars", desc: "Your NFTs as profile pics" }
            ].map((feature, i) => (
              <Card key={i} className="p-4 text-center card-hover glass-effect">
                <feature.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-semibold">{feature.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{feature.desc}</div>
              </Card>
            ))}
          </div>

          <Card className="p-6 card-glow glass-effect">
            <h3 className="text-xl font-semibold mb-4 text-center">Connect Your Wallet</h3>

            <div className="space-y-3">
              <Button
                variant="default"
                size="lg"
                className="w-full justify-center group btn-gradient"
                onClick={async () => {
                  // Preferred wallet order
                  const preferred = ["MetaMask", "Coinbase Wallet"];
                  const findPreferred = connectors.find((c) => preferred.some((p) => c.name.toLowerCase().includes(p.toLowerCase())));
                  const fallback = connectors.find((c) => c.ready) || connectors[0];
                  const target = findPreferred || fallback;
                  if (!target) {
                    // show fallback message
                    try { (await import('sonner')).toast.error('No wallet connectors available'); } catch { console.warn('No sonner available'); }
                    return;
                  }

                  try {
                    connect({ connector: target });
                  } catch (err) {
                    console.error('Connect failed', err);
                    try { (await import('sonner')).toast.error('Failed to connect wallet'); } catch { console.warn('No sonner available'); }
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">Connect Wallet</div>
                    <div className="text-sm opacity-80">MetaMask · Coinbase Wallet · OKX</div>
                  </div>
                </div>
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                New to Web3? <button className="text-primary hover:underline">Learn more</button>
              </p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
