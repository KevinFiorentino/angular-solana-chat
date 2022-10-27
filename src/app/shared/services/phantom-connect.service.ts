import { Injectable, } from '@angular/core';

// Lib principal de Solana Web3
import { Connection, PublicKey, Commitment, clusterApiUrl } from '@solana/web3.js';

// Anchor es el framework para desarrollar contratos en Solana con Rust
import { Program, Provider, setProvider, web3 } from '@project-serum/anchor';

// Cutom Types
import { PhantomSolanaTypes, PhantomProvider } from '@shared/interfaces/phantom.interface';
import { IDL } from '@shared/interfaces/solana-chat.idl';


@Injectable({
  providedIn: 'root'
})
export class PhantomConnectService {

  public walletAddress!: string | undefined;

  public publicKey?: PublicKey;

  constructor() {}

  /* ********** WALLET CONEXION ********** */

  isConnected() {
    setTimeout(async () => {
      const { solana } = window as PhantomSolanaTypes;
      const response = await solana?.connect({ onlyIfTrusted: true });  // Conecta automaticamente si tiene permisos

      this.publicKey = response?.publicKey;
      this.walletAddress = response?.publicKey.toString();

      console.log('Address:', this.walletAddress);
    }, 0);
  }

  async connect() {
    const { solana } = window as PhantomSolanaTypes;
    const response = await solana?.connect({ onlyIfTrusted: false });   // No conecta automaticamente
    this.walletAddress = response?.publicKey.toString();
    console.log('Address:', this.walletAddress);
  }

  async disconnect() {
    const { solana } = window as PhantomSolanaTypes;
    await solana?.disconnect();
  }


  /* ********** CONTRACT CONEXION ********** */

  setContractProvider(): void {
    const network = clusterApiUrl('devnet');    // devnet | testnet | mainnet-beta (Se llama '-beta', pero es la red principal de Solana)

    const comm: Commitment = 'processed';

    const connection = new Connection(network, comm)

    setProvider({
      connection: connection,
      publicKey: this.publicKey
    });
  }

}
