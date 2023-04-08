import { Injectable } from '@angular/core';

// Lib principal de Solana Web3
import * as web3 from '@solana/web3.js';
import { Connection, PublicKey, Commitment, clusterApiUrl, ConfirmOptions, Transaction, TransactionInstruction, Keypair, Signer } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

// Anchor es el framework de Rust para desarrollar contratos en Solana
import * as anchor from '@project-serum/anchor';
import { Wallet } from '@project-serum/anchor';

// Custom Types
import { IDL, SolanaChat } from '@shared/interfaces/solana-chat.idl';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PhantomConnectService {

  private network: string = clusterApiUrl('devnet');              // devnet | testnet | mainnet-beta (Se llama '-beta', pero es la red principal de Solana)
  private comm: Commitment = 'processed';                         // Estado de la transacción al momento de notificar al front-end
  private connection = new Connection(this.network, this.comm);   // Conexión a la red de Solana
  private phantom?: PhantomWalletAdapter;                         // Acceso a Phantom

  private programID = new PublicKey(IDL.metadata.address);        // Clave pública del contrato inteligente

  // Observable para guardar la clave pública del usuario y acceder desde cualquier componente
  private publicKey = new BehaviorSubject<PublicKey | null>(null);
  public listenPublicKey = this.publicKey.asObservable();

  private walletAddress!: string | null;

  constructor() {}

  /* ********** WALLET CONEXION ********** */

  /* async walletConnectAutomatically() {
    const { solana } = window as PhantomSolanaTypes;
    const response = await solana?.connect({ onlyIfTrusted: true })     // Conecta automaticamente si la wallet tiene permisos

    this.publicKey.next(response?.publicKey);
    this.walletAddress = response?.publicKey.toString();

    this.changeWalletListening();
  } */

  async walletConnect() {
    // https://github.com/solana-labs/wallet-adapter/tree/master/packages/wallets/phantom
    this.phantom = new PhantomWalletAdapter();
    await this.phantom.connect();

    if (this.phantom && this.phantom.publicKey) {
      this.setAnchorProvider();
      this.publicKey.next(this.phantom.publicKey);
      this.walletAddress = this.phantom.publicKey.toString();

      // this.changeWalletListening();
    }
  }

  async walletDisconnect() {
    this.publicKey.next(null);
    this.walletAddress = null;
    await this.phantom?.disconnect();
  }


  /* ********** NETWORK CONEXION ********** */

  setAnchorProvider(): void {
    const opts: ConfirmOptions = {
      preflightCommitment: this.comm,
    };
    const provider = new anchor.AnchorProvider(
      this.connection,
      (window as any).solana,
      opts
    );
    anchor.setProvider(provider);
  }

  /* async changeWalletListening() {
    this.phantom?.on('connect', this._accountChanged);
  }

  private _accountChanged = (newPublicKey: PublicKey) => {
    this.walletAddress = newPublicKey.toString();
    this.publicKey.next(newPublicKey);
    this.setAnchorProvider();
  }; */


  /* ********** CONTRACT CONEXION ********** */

  getAllMessages(): Promise<anchor.ProgramAccount<anchor.IdlTypes<SolanaChat>>[]> {
    const provider = anchor.getProvider();
    const program = new anchor.Program(IDL, this.programID, provider);
    return program.account.message.all();
  }

  getMessagesByWalletAddress(walletAddress: string): Promise<anchor.ProgramAccount<anchor.IdlTypes<SolanaChat>>[]> {
    const provider = anchor.getProvider();
    const program = new anchor.Program(IDL, this.programID, provider);
    return program.account.message.all([{
      memcmp: {
        offset: 8,
        bytes: walletAddress
      }
    }]);
  }

  async sendMessage(message: string): Promise<string> {     // Return Transaction ID
    const { SystemProgram, Keypair } = anchor.web3;

    const provider = anchor.getProvider();
    const program = new anchor.Program(IDL, this.programID, provider);
    const kp = Keypair.generate();

    const t = await program.methods
      .createMessage(message)
      .accounts({
        message: kp.publicKey,
        user: provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([kp])
      .transaction();

    return this.signAndSendTransactionWeb(t, kp);
  }

  async updateMessage(message: string, accountPublicKey: PublicKey): Promise<string> {
    const provider = anchor.getProvider();
    const program = new anchor.Program(IDL, this.programID, provider);

    const i = await program.methods
      .updateMessage(message)
      .accounts({
        message: accountPublicKey,
        user: provider.publicKey,
      })
      .transaction();

    return this.signAndSendTransactionWeb(i);
  }


  async deleteMessage(accountPublicKey: PublicKey): Promise<string> {
    const provider = anchor.getProvider();
    const program = new anchor.Program(IDL, this.programID, provider);

    const i = await program.methods
      .deleteMessage()
      .accounts({
        message: accountPublicKey,
        user: provider.publicKey,
      })
      .transaction();

    return this.signAndSendTransactionWeb(i);
  }


  async signAndSendTransactionWeb(t: Transaction, kp?: Signer): Promise<string> {
    const provider = anchor.getProvider();

    t.feePayer = provider.publicKey;

    const latestBlockHash = await this.connection.getLatestBlockhash();
    t.recentBlockhash = latestBlockHash.blockhash;
    t.lastValidBlockHeight = latestBlockHash.lastValidBlockHeight;

    if (kp)
      t.sign(kp)

    if (this.phantom)
      t = await this.phantom?.signTransaction(t);

    return this.connection.sendRawTransaction(t.serialize({ verifySignatures: false, requireAllSignatures: false }));
  }

}
