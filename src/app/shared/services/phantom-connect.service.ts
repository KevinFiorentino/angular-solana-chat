import { Injectable, } from '@angular/core';

// Lib principal de Solana Web3
import * as web3 from '@solana/web3.js';
import { Connection, PublicKey, Commitment, clusterApiUrl, ConfirmOptions } from '@solana/web3.js';

// Anchor es el framework de Rust para desarrollar contratos en Solana
import * as anchor from '@project-serum/anchor';

// Custom Types
import { PhantomSolanaTypes, PhantomProvider } from '@shared/interfaces/phantom.interface';
import { IDL, SolanaChat } from '@shared/interfaces/solana-chat.idl';

@Injectable({
  providedIn: 'root'
})
export class PhantomConnectService {

  private network: string = clusterApiUrl('devnet');          // devnet | testnet | mainnet-beta (Se llama '-beta', pero es la red principal de Solana)
  private comm: Commitment = 'processed';                     // Estado de la transacción al momento de notificar al front-end

  private programID = new PublicKey(IDL.metadata.address);    // Clave pública del contrato inteligente

  private walletAddress!: string | undefined;

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
    const connection = new Connection(this.network, this.comm)

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
