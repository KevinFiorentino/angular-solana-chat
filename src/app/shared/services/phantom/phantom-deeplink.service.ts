import { Injectable } from '@angular/core';
import { Transaction } from '@solana/web3.js';
import { KeypairEncoded, PhantomSessionData, PhantomDeeplinkConnection } from '@shared/models/phantom-deeplink-interfaces';
import { PhantomConnectService } from './phantom-connect.service';
import { environment } from '@environments/environment';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const PHANTOM_SESSION_DATA = 'PHANTOM_SESSION_DATA';

@Injectable({
  providedIn: 'root'
})
export class PhantomDeeplinkService {

  // https://docs.phantom.app/phantom-deeplinks/provider-methods/connect

  private sessionKeypair?: KeypairEncoded;      // Temporary keypair to generate a secure connection between this app and Phantom

  private phantomEncryptionPublicKey?: string;  // Public key used for Phantom for end-to-end encryption
  private phantomSession?: string;              // Session generated later the connection with Phantom, it is necessary to send & sign transactions
  private nonce?: string;                       // Idem 'phantomSession'

  public isAndroid = false;                     // Android Check
  public isIphone = false;                      // IOS Check

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
    if (!this.sessionKeypair)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const params = new URLSearchParams({
      app_url: environment.APP_URL,
      dapp_encryption_public_key: this.sessionKeypair.publicKey,
      redirect_link: `${environment.APP_URL}/redirect/phantom/connect`,
      cluster: 'devnet',
    });

    // Phantom will redirect us to another tab, so the app's state will be lost.
    // We save the 'sessionKeypair' on localstorage to get it again later of the redirection.
    this.setSessionKeypair();

    window.open(`https://phantom.app/ul/v1/connect?${params.toString()}`);
  }

  walletDisconnect(): void {
    if (!this.sessionKeypair)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const payload = { session: this.phantomSession };

    const [nonce, encryptedPayload] = this.encryptDataToPhantom(payload);

    const params = new URLSearchParams({
      dapp_encryption_public_key: this.sessionKeypair.publicKey,
      nonce: bs58.encode(nonce),
      redirect_link: `${environment.APP_URL}/redirect/phantom/disconnect`,
      payload: bs58.encode(encryptedPayload),
    });

    this.deleteSessionKeypair();

    window.open(`https://phantom.app/ul/v1/disconnect?${params.toString()}`);
  }

  signAndSendTransaction(transaction: Transaction) {
    if (!this.sessionKeypair)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const serializedTransaction = bs58.encode(transaction.serialize({ requireAllSignatures: false }));

    const payload = {
      transaction: serializedTransaction,
      session: this.phantomSession
    };

    const [nonce, encryptedPayload] = this.encryptDataToPhantom(payload);

    const params = new URLSearchParams({
      dapp_encryption_public_key: this.sessionKeypair.publicKey,
      nonce: bs58.encode(nonce),
      redirect_link: `${environment.APP_URL}/redirect/phantom/signAndSendTransaction`,
      payload: bs58.encode(encryptedPayload),
    });

    this.setSessionKeypair();

    window.open(`https://phantom.app/ul/v1/disconnect?${params.toString()}`);
  }


  /* ******************************
          REDIRECT METHODS
  ****************************** */

  walletConnectRedirect(
    phantomEncryptionPublicKey: string,
    nonce: string,
    data: string,
  ) {

    const info = this.decryptDataFromPhantom(
      phantomEncryptionPublicKey,
      nonce,
      data
    );

    // Set data later connection
    this.phantomEncryptionPublicKey = phantomEncryptionPublicKey;
    this.nonce = nonce;

    this.phantomSession = info.session;
    this.phantom.walletConnetThroughDeeplink(info.public_key);
  }


  /* ******************************
        ENCRYPT DECRYPT DATA
  ****************************** */

  encryptDataToPhantom(payload: any) {
    if (!this.sessionKeypair)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const nonce = nacl.randomBytes(24);

    const encryptedPayload = nacl.box.after(
      Buffer.from(JSON.stringify(payload)),
      nonce,
      bs58.decode(this.sessionKeypair.secretKey)
    );

    return [nonce, encryptedPayload];
  }

  decryptDataFromPhantom(
    phantomEncryptionPublicKey: string,
    nonce: string,
    data: string,
  ): PhantomDeeplinkConnection {
    if (!this.sessionKeypair)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const sharedSecretDapp = nacl.box.before(
      bs58.decode(phantomEncryptionPublicKey!),
      bs58.decode(this.sessionKeypair.secretKey),
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
      // Save previous keypair
      const data: PhantomSessionData = JSON.parse(previousSessionData)
      this.sessionKeypair = data.keypair;
      this.phantomSession = data.session || '';
      this.nonce = data.nonce || '';
    }
    else {
      // New keypair
      const sessionKeypair = nacl.box.keyPair();
      const keypairEncoded: KeypairEncoded = {
        publicKey: bs58.encode(sessionKeypair.publicKey),
        secretKey: bs58.encode(sessionKeypair.secretKey),
      }
      this.sessionKeypair = keypairEncoded;
    }
  }

  setSessionKeypair() {
    if (!this.sessionKeypair)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const sessionData: PhantomSessionData = {
      keypair: this.sessionKeypair,
      session: this.phantomSession || '',
      nonce: this.nonce || '',
    }
    localStorage.setItem(PHANTOM_SESSION_DATA, JSON.stringify(sessionData));
  }

  deleteSessionKeypair() {
    localStorage.removeItem(PHANTOM_SESSION_DATA);
  }

}
