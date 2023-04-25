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
      this.setAnchorProvider();
      this.publicKey.next(this.phantom.publicKey);
      this.walletAddress = this.phantom.publicKey.toString();

      this.changeWalletListening();
    }
  }

  walletConnetThroughDeeplink(publicKey: string) {
    this.ngZone.run(() => {
      this.setAnchorProvider();
      this.publicKey.next(new PublicKey(publicKey));
      this.walletAddress = publicKey;
    });
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
