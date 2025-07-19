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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Solana Faucet</span>
            </h1>
            <p className="text-gray-300 text-lg">Get free SOL tokens on devnet</p>
          </div>

          {/* Wallet Buttons Loading */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <div className="flex gap-4 justify-center">
              <div className="bg-gray-700 animate-pulse text-gray-400 px-6 py-3 rounded-xl">
                Loading Wallet...
              </div>
              <div className="bg-gray-700 animate-pulse text-gray-400 px-6 py-3 rounded-xl">
                Loading...
              </div>
            </div>
          </div>

          {/* Airdrop Card Loading */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6 text-white text-center">Request Airdrop</h3>
            <div className="mb-4">
              <p className="text-gray-400 mb-2 text-center">Loading airdrop component...</p>
            </div>
            <input 
              type="number" 
              placeholder="Enter Amount (SOL)" 
              disabled
              className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 mb-4"
            />
            <button 
              disabled
              className="w-full bg-gray-700 text-gray-400 p-4 rounded-xl font-semibold"
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
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
              {/* Header */}
              <div className="text-center mb-8 float-animation">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="gradient-text">Solana Faucet</span>
                </h1>
                <p className="text-gray-300 text-lg">Get free SOL tokens on devnet</p>
                <div className="flex justify-center mt-4">
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </div>
              </div>

              {/* Wallet Buttons */}
              <div className="glass-card rounded-2xl p-6 mb-6">
                <WalletButtons />
              </div>

              {/* Airdrop Component */}
              <Airdrop/>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}