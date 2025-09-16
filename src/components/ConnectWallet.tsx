import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useConnect, useAccount } from "wagmi";
import { Wallet, Shield, Zap, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import heroImage from "@/assets/baseline-hero.jpg";

interface ConnectWalletProps {
  onConnect: () => void;
}

const ConnectWallet = ({ onConnect }: ConnectWalletProps) => {
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      onConnect();
    }
  }, [isConnected, onConnect]);

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
              <span className="text-2xl">⚡</span>
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
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  variant="default"
                  size="lg"
                  className="w-full justify-between group btn-gradient"
                  onClick={() => connect({ connector })}
                  disabled={!connector.ready}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">{connector.name}</div>
                      <div className="text-sm opacity-80">Connect with {connector.name}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                New to Web3? <button className="text-primary hover:underline">Learn more</button>
              </p>
            </div>
          </Card>

          {/* Network Info */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/50 rounded-full text-sm glass-effect">
              <div className="connection-dot"></div>
              <span>Base Mainnet (Chain ID: 8453)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;