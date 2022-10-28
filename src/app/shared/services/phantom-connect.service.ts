import { Injectable, } from '@angular/core';

// Lib principal de Solana Web3
import { Connection, PublicKey, Commitment, clusterApiUrl, ConfirmOptions } from '@solana/web3.js';

// Anchor es el framework para desarrollar contratos en Solana con Rust
import * as anchor from '@project-serum/anchor';
import { Program, ProgramAccount } from '@project-serum/anchor';
/* import { Program, Provider, AnchorProvider, setProvider, getProvider, web3 } from '@project-serum/anchor'; */
/* const { PublicKey, SystemProgram, Keypair, Connection, clusterApiUrl } = anchor.web3; */


// Custom Types
import { PhantomSolanaTypes, PhantomProvider } from '@shared/interfaces/phantom.interface';
import { IDL, SolanaChat } from '@shared/interfaces/solana-chat.idl';
import { TypeDef, IdlTypes } from '@project-serum/anchor/dist/cjs/program/namespace/types';


@Injectable({
  providedIn: 'root'
})
export class PhantomConnectService {

  public walletAddress!: string | undefined;

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
    const opts: ConfirmOptions = {
      preflightCommitment: 'processed',
    };

    const provider = new anchor.AnchorProvider(
      connection,
      window.solana,
      opts
    );
    anchor.setProvider(provider);
  }


  /* ********** CONTRACT CONEXION ********** */

  getAllMessages() /* : Promise<ProgramAccount<any>[]> */ {
    const programID = new PublicKey(IDL.metadata.address);
    const provider = anchor.getProvider();
    const program = new Program(IDL, programID, provider);

    return program.account.message.all();
  }

  async sendMessage() {
    const { SystemProgram, Keypair } = anchor.web3;
    const programID = new PublicKey(IDL.metadata.address);
    const provider = anchor.getProvider();
    const program = new Program(IDL, programID, provider);

    const text = 'Test2';
    const msg = Keypair.generate();

    const txId = await program.methods
      .createMessage(text)
      .accounts({
        message: msg.publicKey,
        user: provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([msg])
      .rpc();

    console.log('txId', txId)
  }

}
