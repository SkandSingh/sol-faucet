'use client'
import {  useEffect, useMemo, useState } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";

import { clusterApiUrl } from '@solana/web3.js';

import WalletButtons from "./components/WalletButtons";
import Airdrop from "./components/Airdrop";

import "@solana/wallet-adapter-react-ui/styles.css";


export default function App() {
  const [mounted, setMounted] = useState(false);
  
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Solana Wallet & Airdrop</h1>
          <div className="flex gap-4 mb-4">
            <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded">
              Loading Wallet...
            </button>
            <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded">
              Loading...
            </button>
          </div>
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Request Airdrop</h3>
            <p className="text-sm text-gray-600 mb-2">Loading airdrop component...</p>
            <input 
              type="number" 
              placeholder="Enter Amount (SOL)" 
              disabled
              className="w-full p-2 border rounded mb-3 bg-gray-100"
            />
            <button 
              disabled
              className="w-full bg-gray-400 text-white p-2 rounded opacity-50"
            >
              Loading...
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={[]} 
        autoConnect={false}
        onError={(error) => {
          console.error('Wallet error:', error);
        }}
      >
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-center mb-8">Solana Wallet & Airdrop</h1>
              <WalletButtons />
              <Airdrop/>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}