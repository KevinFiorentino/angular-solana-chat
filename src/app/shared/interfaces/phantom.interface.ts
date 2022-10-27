// Source: https://medium.com/@jorge.londono_31005/intro-to-solana-webapp-development-with-react-typescript-phantom-ca2724d1fa22

import { PublicKey } from '@solana/web3.js';

export type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged';

export interface ConnectOpts {
  onlyIfTrusted: boolean;
}

export interface PhantomProvider {
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: ()=>Promise<void>;
  on: (event: PhantomEvent, callback: (args:any)=>void) => void;
  isPhantom: boolean;
}

export type PhantomSolanaTypes = Window & {
  solana?: PhantomProvider;
}
