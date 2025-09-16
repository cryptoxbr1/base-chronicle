import React, { useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  if (!isConnected) {
    return <ConnectWallet onConnect={handleConnect} />;
  }

  return <Dashboard onDisconnect={handleDisconnect} />;
};

export default Index;
