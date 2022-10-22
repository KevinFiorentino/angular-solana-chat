import { Injectable, } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { PhantomSolanaTypes, PhantomProvider } from '@shared/interfaces/phantom.interface';

@Injectable({
  providedIn: 'root'
})
export class PhantomConnectService {

  public walletAddress!: string | undefined;

  constructor() {}

  isConnected() {
    setTimeout(async () => {
      const { solana } = window as PhantomSolanaTypes;
      const response = await solana?.connect({ onlyIfTrusted: true });
      this.walletAddress = response?.publicKey.toString();
      console.log('Address:', this.walletAddress);
    }, 0);
  }

  async connect() {
    const { solana } = window as PhantomSolanaTypes;
    const response = await solana?.connect({ onlyIfTrusted: false });
    this.walletAddress = response?.publicKey.toString();
    console.log('Address:', this.walletAddress);
  }

  async disconnect() {
    const { solana } = window as PhantomSolanaTypes;
    await solana?.disconnect();
  }

}
