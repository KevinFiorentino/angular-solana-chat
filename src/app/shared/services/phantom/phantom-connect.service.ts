import { Injectable, NgZone } from '@angular/core';
import { Connection, PublicKey, Commitment, clusterApiUrl, ConfirmOptions, Transaction, Signer, Keypair } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { BehaviorSubject } from 'rxjs';
import { AnchorProvider, getProvider, setProvider } from '@project-serum/anchor';


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

  async walletConnect() {
    // https://github.com/solana-labs/wallet-adapter/tree/master/packages/wallets/phantom
    this.phantom = new PhantomWalletAdapter();
    await this.phantom.connect();

    if (this.phantom && this.phantom.publicKey) {
      this.walletAddress = this.phantom.publicKey.toString();
      this.setAnchorProvider();
      this.publicKey.next(this.phantom.publicKey);

      this.changeWalletListening();
    }
  }

  walletConnetThroughDeeplink(publicKey: string) {
    // The order is important due to we use this.walletAddress to set the AnchorProvider
    this.walletAddress = publicKey;
    this.setAnchorProviderMock();
    this.publicKey.next(new PublicKey(publicKey));
  }

  async walletDisconnect() {
    this.publicKey.next(null);
    this.walletAddress = null;
    await this.phantom?.disconnect();
  }

  walletDisconnetThroughDeeplink(publicKey: string) {
    this.publicKey.next(null);
    this.walletAddress = null;
  }


  /* ********** NETWORK CONEXION ********** */

  setAnchorProvider(): void {
    const opts: ConfirmOptions = { preflightCommitment: this.comm };
    const provider = new AnchorProvider(
      this.connection,
      (window as any).solana,
      opts
    );
    setProvider(provider);
  }

  setAnchorProviderMock(): void {
    if (!this.walletAddress)
      return

    const opts: ConfirmOptions = { preflightCommitment: this.comm };
    const wallet = {
      publicKey: new PublicKey(this.walletAddress),   // Mock user wallet, this is important due to it will be the address signer
      signTransaction: () => Promise.reject(),
      signAllTransactions: () => Promise.reject(),
    };
    const provider = new AnchorProvider(this.connection, wallet, opts);
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


  /* ********** TRANSACTION SIGN & SEND ********** */

  async signAndSendTransactionWeb(t: Transaction, signer?: Signer): Promise<string> {

    const tPrepared = await this.prepareTransaction(t, signer);

    let tSigned: Transaction | undefined;

    if (this.phantom)
      tSigned = await this.phantom?.signTransaction(tPrepared);
    else
      throw new Error('Something was wrong with the user\'s wallet');

    return this.connection.sendRawTransaction(
      tSigned.serialize({ verifySignatures: false, requireAllSignatures: false })
    );
  }


  /* ********** TRANSACTION PREPARATION ********** */

  async prepareTransaction(t: Transaction, signer?: Signer): Promise<Transaction> {
    const provider = getProvider();

    t.feePayer = provider.publicKey;

    const latestBlockHash = await this.connection.getLatestBlockhash();
    t.recentBlockhash = latestBlockHash.blockhash;
    t.lastValidBlockHeight = latestBlockHash.lastValidBlockHeight;

    if (signer)
      t.sign(signer);

    return t;
  }

}
