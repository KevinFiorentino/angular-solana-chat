import { Injectable, NgZone } from '@angular/core';
import { Connection, PublicKey, Commitment, clusterApiUrl, ConfirmOptions, Transaction, Signer, Keypair } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { BehaviorSubject } from 'rxjs';
import { AnchorProvider, getProvider, setProvider } from '@project-serum/anchor';
import * as bs58 from 'bs58';

@Injectable({
  providedIn: 'root'
})
export class PhantomConnectService {

  private network: string = clusterApiUrl('devnet');              // devnet | testnet | mainnet-beta (Se llama '-beta', pero es la red principal de Solana)
  private comm: Commitment = 'processed';                         // Estado de la transacción al momento de notificar al front-end
  private connection = new Connection(this.network, this.comm);   // Conexión a la red de Solana
  private phantom?: PhantomWalletAdapter;                         // Acceso a Phantom

  // Observable para guardar la clave pública del usuario y acceder desde cualquier componente
  private publicKey = new BehaviorSubject<PublicKey | null>(null);
  public listenPublicKey = this.publicKey.asObservable();

  private walletAddress!: string | null;

  constructor(
    private ngZone: NgZone,
  ) {}

  /* ********** WALLET CONEXION ********** */

  /* async walletConnectAutomatically() {
    const { solana } = window as PhantomSolanaTypes;
    const response = await solana?.connect({ onlyIfTrusted: true })     // Conecta automaticamente si la wallet tiene permisos

    this.publicKey.next(response?.publicKey);
    this.walletAddress = response?.publicKey.toString();

    this.changeWalletListening();
  } */

  async walletConnect() {

    const pk = new Keypair();

    const params = new URLSearchParams();
    params.append('app_url', 'https://angular-solana-chat.vercel.app/');
    params.append('dapp_encryption_public_key', pk.publicKey.toString());
    params.append('redirect_link', 'https://angular-solana-chat.vercel.app/');
    params.append('cluster', 'devnet');

    const childWindow = window.open(`https://phantom.app/ul/v1/connect?${params.toString()}`);
    window.addEventListener('message', this.handleMessage.bind(this), false);

    // https://github.com/solana-labs/wallet-adapter/tree/master/packages/wallets/phantom
    /* this.phantom = new PhantomWalletAdapter();
    await this.phantom.connect();

    if (this.phantom && this.phantom.publicKey) {
      this.setAnchorProvider();
      this.publicKey.next(this.phantom.publicKey);
      this.walletAddress = this.phantom.publicKey.toString();

      this.changeWalletListening();
    } */
  }

  handleMessage(event: MessageEvent) {
    console.log(event.data);
    setTimeout(() => {
      alert(event.data);
    }, 2000);
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
    const provider = new AnchorProvider(
      this.connection,
      (window as any).solana,
      opts
    );
    setProvider(provider);
  }

  async changeWalletListening() {
    this.phantom?.on('connect', this._accountChanged);
  }

  private _accountChanged = (newPublicKey: PublicKey) => {
    this.ngZone.run(() => {
      this.walletAddress = newPublicKey.toString();
      this.publicKey.next(newPublicKey);
      this.setAnchorProvider();
    });
  };


  /* ********** TRANSACTION SIGN ********** */

  async signAndSendTransactionWeb(t: Transaction, signer?: Signer): Promise<string> {
    const provider = getProvider();

    t.feePayer = provider.publicKey;

    const latestBlockHash = await this.connection.getLatestBlockhash();
    t.recentBlockhash = latestBlockHash.blockhash;
    t.lastValidBlockHeight = latestBlockHash.lastValidBlockHeight;

    if (signer)
      t.sign(signer);

    if (this.phantom)
      t = await this.phantom?.signTransaction(t);

    return this.connection.sendRawTransaction(
      t.serialize({ verifySignatures: false, requireAllSignatures: false })
    );
  }

}
