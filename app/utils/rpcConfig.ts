import { Connection, clusterApiUrl } from '@solana/web3.js';

export interface RpcEndpoint {
  name: string;
  url: string;
  priority: number;
}

export const RPC_ENDPOINTS: RpcEndpoint[] = [
  {
    name: 'Alchemy',
    url: 'https://solana-devnet.g.alchemy.com/v2/qT9w-C2po9DHCwHJ29AMi',
    priority: 1
  },
  {
    name: 'Solana Public Devnet',
    url: clusterApiUrl('devnet'),
    priority: 2
  },
  {
    name: 'Helius (fallback)',
    url: 'https://devnet.helius-rpc.com/?api-key=your-key-here',
    priority: 3
  }
];

export function getPrimaryEndpoint(): string {
  return RPC_ENDPOINTS[0].url;
}

export function createFallbackConnection(): Connection {
  return new Connection(RPC_ENDPOINTS[1].url, 'confirmed');
}

export async function testRpcConnection(url: string): Promise<boolean> {
  try {
    const connection = new Connection(url, 'confirmed');
    await connection.getLatestBlockhash();
    return true;
  } catch {
    return false;
  }
}
