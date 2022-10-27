import { Injectable, } from '@angular/core';

// Lib principal de Solana Web3
import { Connection, PublicKey, Commitment, clusterApiUrl } from '@solana/web3.js';

// Anchor es el framework para desarrollar contratos en Solana con Rust
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
/* import { Program, Provider, AnchorProvider, setProvider, getProvider, web3 } from '@project-serum/anchor'; */
/* const { PublicKey, SystemProgram, Keypair, Connection, clusterApiUrl } = anchor.web3; */


// Custom Types
import { PhantomSolanaTypes, PhantomProvider } from '@shared/interfaces/phantom.interface';
import { IDL, SolanaChat } from '@shared/interfaces/solana-chat.idl';


@Injectable({
  providedIn: 'root'
})
export class PhantomConnectService {

  public walletAddress!: string | undefined;

  /* public publicKey?: typeof PublicKey; */

  constructor() {
    setTimeout(() => {
      this.setContractProvider();
      console.log('Provider OK')
    }, 1000)
  }

  /* ********** WALLET CONEXION ********** */

  isConnected() {
    setTimeout(async () => {
      const { solana } = window as PhantomSolanaTypes;
      const response = await solana?.connect({ onlyIfTrusted: true });  // Conecta automaticamente si tiene permisos

      /* this.publicKey = response?.publicKey; */
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


  /* ********** NETWORK CONEXION ********** */

  setContractProvider(): void {

    const network = clusterApiUrl('devnet');    // devnet | testnet | mainnet-beta (Se llama '-beta', pero es la red principal de Solana)
    const comm: Commitment = 'processed';
    const connection = new Connection(network, comm)
    const opts = {
      preflightCommitment: "processed",
    };

    /* const provider = new anchor.AnchorProvider(
      connection: connection,
      wallet: window.solana,
      opts: opts
    );;
    anchor.setProvider(provider); */

    /*

    setProvider({
      connection: connection,
      publicKey: this.publicKey
    }); */
  }


  /* ********** CONTRACT CONEXION ********** */

  getAllMessages(): Promise<any> {
    const programID = new PublicKey(IDL.metadata.address);
    const provider = anchor.getProvider();

    const program = new Program(IDL, programID, provider);
    /* const program = anchor.workspace.SolanaChat as Program<SolanaChat>; */

    return program.account.message.all();
  }

  async sendMessage() {
    /* const { SystemProgram, Keypair } = web3;
    const programID = new PublicKey(IDL.metadata.address);

    const provider = getProvider();

    const program = new Program(IDL, programID, provider);

    const text = await program.methods.createMessage('First Message').rpc();

    console.log('text', text) */
  }

}
