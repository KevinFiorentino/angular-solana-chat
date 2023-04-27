import { Injectable } from '@angular/core';
import { Signer, Transaction } from '@solana/web3.js';
import { KeypairEncoded, PhantomSessionData, PhantomDeeplinkConnection, PhantomDeeplinkSignAndSend } from '@shared/models/phantom-deeplink-interfaces';
import { PhantomConnectService } from './phantom-connect.service';
import { environment } from '@environments/environment';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const PHANTOM_SESSION_DATA = 'PHANTOM_SESSION_DATA';

@Injectable({
  providedIn: 'root'
})
export class PhantomDeeplinkService {

  // Connection data
  private dappEncryptionPublicKey?: KeypairEncoded;    // Temporary keypair to generate a secure connection between this app and Phantom
  private phantomEncryptionPublicKey?: string;      // Public key used for Phantom for end-to-end encryption
  private nonce?: string;                           // Nonce generated during the connection
  private session?: string;                         // Session generated later the connection with Phantom, it is necessary to send & sign transactions

  private walletAddress?: string;                   // Public key of user wallet address

  public isAndroid = false;                         // Android Check
  public isIphone = false;                          // IOS Check

  constructor(
    private phantom: PhantomConnectService,
  ) {
    // Private keypair
    this.getAndSaveSessionKeypair();

    // User agent
    const ua = navigator.userAgent.toLowerCase();
    this.isAndroid = ua.indexOf('android') > -1;
    this.isIphone = ua.indexOf('iphone') > -1;
  }

  isMobileDevice(): boolean {
    return this.isAndroid || this.isIphone ? true : false;
  }


  /* ******************************
       PHANTOM DEEPLINK METHODS
  ****************************** */

  // Documentation: https://docs.phantom.app/phantom-deeplinks/provider-methods

  walletConnect(): void {
    if (!this.dappEncryptionPublicKey)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const params = new URLSearchParams({
      app_url: environment.APP_URL,
      dapp_encryption_public_key: this.dappEncryptionPublicKey.publicKey,
      redirect_link: `${environment.APP_URL}/redirect/phantom/connect`,
      cluster: 'devnet',
    });

    // Phantom will redirect us to another tab, so the app's state will be lost.
    // We save the 'sessionKeypair' on localstorage to get it again later of the redirection.
    this.setSessionKeypair();

    window.open(`https://phantom.app/ul/v1/connect?${params.toString()}`);
  }

  walletDisconnect(): void {
    if (!this.dappEncryptionPublicKey)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const payload = { session: this.session };

    const [nonce, encryptedPayload] = this.encryptDataToPhantom(payload);

    const params = new URLSearchParams({
      dapp_encryption_public_key: this.dappEncryptionPublicKey.publicKey,
      nonce: bs58.encode(nonce),
      redirect_link: `${environment.APP_URL}/redirect/phantom/disconnect`,
      payload: bs58.encode(encryptedPayload),
    });

    this.deleteSessionKeypair();

    window.open(`https://phantom.app/ul/v1/disconnect?${params.toString()}`);
  }

  async signAndSendTransaction(t: Transaction, signer?: Signer) {
    if (!this.dappEncryptionPublicKey)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    // Prepare transaction
    const tPrepared = await this.phantom.prepareTransaction(t, signer);

    // Prepare connection with Phantom
    const serializedTransaction = bs58.encode(
      tPrepared.serialize({ verifySignatures: false, requireAllSignatures: false })
    );

    const payload = {
      transaction: serializedTransaction,
      session: this.session
    };

    const [nonce, encryptedPayload] = this.encryptDataToPhantom(payload);

    const params = new URLSearchParams({
      dapp_encryption_public_key: this.dappEncryptionPublicKey.publicKey,
      nonce: bs58.encode(nonce),
      redirect_link: `${environment.APP_URL}/redirect/phantom/signAndSendTransaction`,
      payload: bs58.encode(encryptedPayload),
    });

    // Save Phantom deeplink session
    this.setSessionKeypair();

    window.open(`https://phantom.app/ul/v1/signAndSendTransaction?${params.toString()}`);
  }


  /* ******************************
          REDIRECT METHODS
  ****************************** */

  // https://docs.phantom.app/phantom-deeplinks/provider-methods/connect
  walletConnectRedirect(
    phantomEncryptionPublicKey: string,
    nonce: string,
    data: string,
  ): void {

    // Set connection data
    this.phantomEncryptionPublicKey = phantomEncryptionPublicKey;
    this.nonce = nonce;

    const info: PhantomDeeplinkConnection = this.decryptDataFromPhantom(
      nonce,
      data,
    );

    this.session = info.session;
    this.walletAddress = info.public_key;

    this.phantom.walletConnetThroughDeeplink(this.walletAddress);
  }

  // https://docs.phantom.app/phantom-deeplinks/provider-methods/signandsendtransaction
  signAndSendTransactionRedirect(
    nonce: string,
    data: string,
  ) {

    // Restore session
    this.getAndSaveSessionKeypair();

    if (this.walletAddress)
      this.phantom.walletConnetThroughDeeplink(this.walletAddress);

    // Decrypt data
    const info: PhantomDeeplinkSignAndSend = this.decryptDataFromPhantom(
      nonce,
      data,
    );

    return info.signature;
  }


  /* ******************************
        ENCRYPT DECRYPT DATA
  ****************************** */

  encryptDataToPhantom(payload: any) {
    if (!this.dappEncryptionPublicKey)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const nonce = nacl.randomBytes(24);

    const sharedSecretDapp = nacl.box.before(
      bs58.decode(this.phantomEncryptionPublicKey!),
      bs58.decode(this.dappEncryptionPublicKey.secretKey),
    );

    const encryptedPayload = nacl.box.after(
      Buffer.from(JSON.stringify(payload)),
      nonce,
      sharedSecretDapp
    );

    return [nonce, encryptedPayload];
  }

  decryptDataFromPhantom(
    nonce: string,
    data: string,
  ): any {
    if (!this.dappEncryptionPublicKey || !this.phantomEncryptionPublicKey)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const sharedSecretDapp = nacl.box.before(
      bs58.decode(this.phantomEncryptionPublicKey),
      bs58.decode(this.dappEncryptionPublicKey.secretKey),
    );

    const decryptedData = nacl.box.open.after(
      bs58.decode(data),
      bs58.decode(nonce),
      sharedSecretDapp,
    );

    if (!decryptedData)
      throw new Error('An error occurred while decrypting the data.');

    return JSON.parse(Buffer.from(decryptedData).toString('utf8'));
  }


  /* ******************************
            LOCAL STORAGE
  ****************************** */

  getAndSaveSessionKeypair() {
    const previousSessionData = localStorage.getItem(PHANTOM_SESSION_DATA);
    if (previousSessionData) {
      // Save previous session data
      const data: PhantomSessionData = JSON.parse(previousSessionData)
      this.dappEncryptionPublicKey = data.keypair;
      this.walletAddress = data.walletAddress || '';
      this.phantomEncryptionPublicKey = data.phantomEncryptionPublicKey || '';
      this.session = data.session || '';
      this.nonce = data.nonce || '';
    }
    else {
      // New keypair
      const kp = nacl.box.keyPair();
      const keypairEncoded: KeypairEncoded = {
        publicKey: bs58.encode(kp.publicKey),
        secretKey: bs58.encode(kp.secretKey),
      }
      this.dappEncryptionPublicKey = keypairEncoded;
    }
  }

  setSessionKeypair() {
    if (!this.dappEncryptionPublicKey)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const sessionData: PhantomSessionData = {
      keypair: this.dappEncryptionPublicKey,
      walletAddress: this.walletAddress || '',
      phantomEncryptionPublicKey: this.phantomEncryptionPublicKey || '',
      session: this.session || '',
      nonce: this.nonce || '',
    }
    localStorage.setItem(PHANTOM_SESSION_DATA, JSON.stringify(sessionData));
  }

  deleteSessionKeypair() {
    localStorage.removeItem(PHANTOM_SESSION_DATA);
  }

}
