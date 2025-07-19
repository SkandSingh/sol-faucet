'use client';

import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

export default function WalletButtons() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR mismatch by showing loading state until mounted
  if (!mounted) {
    return (
      <div className="flex gap-4 justify-center">
        <div className="bg-gray-700 animate-pulse text-gray-400 px-6 py-3 rounded-xl">
          Loading Wallet...
        </div>
        <div className="bg-gray-700 animate-pulse text-gray-400 px-6 py-3 rounded-xl">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      <div key="wallet-multi-button" className="transform transition-transform hover:scale-105">
        <WalletMultiButton />
      </div>
      <div key="wallet-disconnect-button" className="transform transition-transform hover:scale-105">
        <WalletDisconnectButton />
      </div>
    </div>
  );
}