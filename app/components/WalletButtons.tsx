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
      <div className="flex gap-4 mb-4">
        <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded">
          Loading Wallet...
        </button>
        <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded">
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 mb-4">
      <div key="wallet-multi-button">
        <WalletMultiButton />
      </div>
      <div key="wallet-disconnect-button">
        <WalletDisconnectButton />
      </div>
    </div>
  );
}