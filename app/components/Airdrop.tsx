'use client'
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useState, useEffect } from "react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

export default function Airdrop() {
    const wallet = useWallet();
    const {connection} = useConnection();
    const [amount, setAmount] = useState<string>(""); 
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent SSR mismatch
    if (!mounted) {
        return (
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-white text-center">Request Airdrop</h3>
                <div className="mb-4">
                    <p className="text-gray-400 mb-2 text-center">Loading airdrop component...</p>
                </div>
                <input 
                    type="number" 
                    placeholder="Enter Amount (SOL)" 
                    value=""
                    onChange={() => {}}
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
        );
    }

    async function sendAirdrop(){
        if (!wallet.publicKey) {
            alert("Wallet not connected!");
            return;
        }

        const solAmount = parseFloat(amount);
        if (!solAmount || solAmount <= 0 || solAmount > 2) {
            alert("Please enter a valid amount between 0.1 and 2 SOL");
            return;
        }

        setLoading(true);
        try {
            console.log("Requesting airdrop for:", wallet.publicKey.toString());
            console.log("Amount:", solAmount, "SOL");
            console.log("Using RPC:", connection.rpcEndpoint);
            
            const lamports = solAmount * LAMPORTS_PER_SOL;
            console.log("Lamports:", lamports);
            
            const signature = await connection.requestAirdrop(wallet.publicKey, lamports);
            console.log("Airdrop signature:", signature);
            
            
            const latestBlockHash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: signature,
            });
            
            console.log("Transaction confirmed!");
            alert(`Airdrop successful! ${solAmount} SOL sent to your wallet\nSignature: ${signature}`);
            setAmount(""); 
        } catch (error) {
            console.error("Airdrop error:", error);
            
            // Better error handling for common issues
            if (error instanceof Error) {
                if (error.message.includes("429") || error.message.includes("rate")) {
                    alert("Rate limit exceeded. Please wait a few minutes before requesting another airdrop.");
                } else if (error.message.includes("airdrop") || error.message.includes("insufficient")) {
                    alert("Airdrop failed. The devnet faucet may be temporarily unavailable. Try a smaller amount or try again later.");
                } else if (error.message.includes("blockhash") || error.message.includes("timeout")) {
                    alert("Transaction timed out. Please try again.");
                } else {
                    alert(`Airdrop failed: ${error.message}\n\nTip: You can also use https://faucet.solana.com for manual airdrops.`);
                }
            } else {
                alert("Airdrop failed: Unknown error. Try using https://faucet.solana.com for manual airdrops.");
            }
            
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6 text-white text-center flex items-center justify-center gap-2">
                <span className="text-2xl">💧</span>
                Request Airdrop
            </h3>
            
            {/* Connection Status */}
            <div className="mb-6">
                {wallet.connected && wallet.publicKey ? (
                    <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 text-center">
                        <p className="text-green-400 font-medium flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Wallet Connected
                        </p>
                        <p className="text-green-300 text-sm mt-1 font-mono">
                            {wallet.publicKey.toString().slice(0, 8)}...{wallet.publicKey.toString().slice(-8)}
                        </p>
                    </div>
                ) : (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 text-center">
                        <p className="text-red-400 font-medium flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            Please connect your wallet first
                        </p>
                    </div>
                )}
            </div>

            {/* Amount Input */}
            <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                    Amount (SOL)
                </label>
                <div className="relative">
                    <input 
                        type="number" 
                        placeholder="Enter amount (0.1 - 2.0)" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value || "")}
                        max="2"
                        min="0.1"
                        step="0.1"
                        className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 dark-input transition-all duration-200 pr-16"
                        disabled={loading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                        SOL
                    </div>
                </div>
                <p className="text-gray-400 text-xs mt-2">Maximum 2 SOL per request</p>
            </div>
            
            {/* Airdrop Button */}
            <button 
                onClick={sendAirdrop} 
                disabled={loading || !wallet.connected}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 text-white p-4 rounded-xl font-semibold transition-all duration-200 glow-button disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Requesting Airdrop...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <span>💰</span>
                        Send Airdrop
                    </span>
                )}
            </button>

            {/* Info */}
            <div className="mt-6 text-center">
                <p className="text-gray-400 text-xs">
                    Free SOL tokens for Solana devnet testing
                </p>
            </div>
        </div>
    )
}