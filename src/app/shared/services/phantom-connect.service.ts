import { Injectable } from '@angular/core';

// Lib principal de Solana Web3
import * as web3 from '@solana/web3.js';
import { Connection, PublicKey, Commitment, clusterApiUrl, ConfirmOptions } from '@solana/web3.js';

// Anchor es el framework de Rust para desarrollar contratos en Solana
import * as anchor from '@project-serum/anchor';

// Custom Types
import { PhantomSolanaTypes, PhantomProvider } from '@shared/interfaces/phantom.interface';
import { IDL, SolanaChat } from '@shared/interfaces/solana-chat.idl';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhantomConnectService {

  private network: string = clusterApiUrl('devnet');              // devnet | testnet | mainnet-beta (Se llama '-beta', pero es la red principal de Solana)
  private comm: Commitment = 'processed';                         // Estado de la transacción al momento de notificar al front-end
  private connection = new Connection(this.network, this.comm);   // Conexión a la red de Solana

  private programID = new PublicKey(IDL.metadata.address);        // Clave pública del contrato inteligente

  private publicKey = new BehaviorSubject<PublicKey | null>(null);
  public listenPublicKey = this.publicKey.asObservable();

  private walletAddress!: string | null;

  constructor() {
    setTimeout(async () => {
      this.setContractProvider();
    }, 0);
  }

  /* ********** WALLET CONEXION ********** */

  /* isConnected() {
    setTimeout(async () => {
      const { solana } = window as PhantomSolanaTypes;
      const response = await solana?.connect({ onlyIfTrusted: true });  // Conecta automaticamente si tiene permisos
      this.walletAddress = response?.publicKey.toString();
      this.publicKey = response?.publicKey;
      this.changeWalletListening();
    }, 0);
  } */

  async walletConnect() {
    const { solana } = window as PhantomSolanaTypes;
    const response = await solana?.connect({ onlyIfTrusted: false });   // No conecta automaticamente

    this.publicKey.next(response?.publicKey);
    this.walletAddress = response?.publicKey.toString();

    this.changeWalletListening();
  }

  async walletDisconnect() {
    const { solana } = window as PhantomSolanaTypes;
    this.publicKey.next(null);
    this.walletAddress = null;
    await solana?.disconnect();
  }


  /* ********** NETWORK CONEXION ********** */

  setContractProvider(): void {
    const opts: ConfirmOptions = {
      preflightCommitment: this.comm,
    };

    const provider = new anchor.AnchorProvider(
      this.connection,
      window.solana,
      opts
    );
    anchor.setProvider(provider);
  }

  async changeWalletListening() {
    setInterval(() => {
      if (window?.solana?.publicKey.toString() != this.walletAddress) {
        this.publicKey.next(window.solana.publicKey);
        this.walletAddress = window.solana.publicKey.toString();
        console.log('Cambio de wallet!!!!!');
      }
    }, 2000);
  }


  /* ********** CONTRACT CONEXION ********** */

  getAllMessages() /* : Promise<ProgramAccount<any>[]> */ {
    const provider = anchor.getProvider();
    const program = new anchor.Program(IDL, this.programID, provider);
    return program.account.message.all();
  }

  async sendMessage(message: string) {
    const { SystemProgram, Keypair } = anchor.web3;

    const provider = anchor.getProvider();
    const program = new anchor.Program(IDL, this.programID, provider);
    const kp = Keypair.generate();

    const txId = await program.methods
      .createMessage(message)
      .accounts({
        message: kp.publicKey,
        user: provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([kp])
      .rpc();

    console.log('txId', txId);
  }

}
