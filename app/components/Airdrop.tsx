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
            <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Request Airdrop</h3>
                <p className="text-sm text-gray-600 mb-2">Loading airdrop component...</p>
                <input 
                    type="number" 
                    placeholder="Enter Amount (SOL)" 
                    value=""
                    onChange={() => {}}
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
        <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Request Airdrop</h3>
            
            
            {wallet.connected && wallet.publicKey ? (
                <p className="text-sm text-green-600 mb-2">
                    Wallet Connected: {wallet.publicKey.toString().slice(0, 8)}...
                </p>
            ) : (
                <p className="text-sm text-red-600 mb-2">Please connect your wallet first</p>
            )}
            
            <input 
                type="number" 
                placeholder="Enter Amount (SOL)" 
                value={amount}
                onChange={(e) => setAmount(e.target.value || "")}
                max="2"
                min="0.1"
                step="0.1"
                className="w-full p-2 border rounded mb-3"
                disabled={loading}
            />
            
            <button 
                onClick={sendAirdrop} 
                disabled={loading || !wallet.connected}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? "Requesting..." : "Send Airdrop"}
            </button>
        </div>
    )
}