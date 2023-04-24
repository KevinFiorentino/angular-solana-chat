import { Injectable } from "@angular/core";
import { KeypairEncoded, PhantomSessionData, PhantomDeeplinkConnection } from '@shared/models/phantom-deeplink-interfaces';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const PHANTOM_SESSION_DATA = 'PHANTOM_SESSION_DATA';

@Injectable({
  providedIn: 'root'
})
export class PhantomDeeplinkService {

  private sessionKeypair?: KeypairEncoded;     // Temporary keypair to generate a secure connection between this app and Phantom

  private phantomSession?: string;             // Session generated later the connection with Phantom, it is necessary to send & sign transactions
  private nonce?: string;                      // Idem 'phantomSession'

  public isAndroid = false;                    // Android Check
  public isIphone = false;                     // IOS Check

  constructor() {
    // Private keypair
    this.getAndSaveSessionKeypair();

    // User agent
    const ua = navigator.userAgent.toLowerCase();
    this.isAndroid = ua.indexOf("android") > -1;
    this.isIphone = ua.indexOf("iphone") > -1;
  }

  isMobileDevice(): boolean {
    return this.isAndroid || this.isIphone ? true : false;
  }

  async walletConnect() {
    if (!this.sessionKeypair)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const params = new URLSearchParams();
    params.append('app_url', 'https://angular-solana-chat.vercel.app/');
    params.append('dapp_encryption_public_key', this.sessionKeypair.publicKey);
    params.append('redirect_link', 'https://angular-solana-chat.vercel.app');
    params.append('cluster', 'devnet');

    // Phantom will redirect us to another tab, so the app's state will be lost.
    // We save the 'sessionKeypair' on localstorage to get it again later of the redirection.
    this.setSessionKeypair();

    window.open(`https://phantom.app/ul/v1/connect?${params.toString()}`);
  }

  async walletDisconnect() {

  }


  /* ******************************
        ENCRYPT DECRYPT DATA
  ****************************** */

  encryptDataToPhantom() {

  }

  decryptDataFromPhantom(
    phantom_encryption_public_key: string,
    data: string,
    nonce: string,
  ): PhantomDeeplinkConnection {
    if (!this.sessionKeypair)
      throw new Error('An error occurred with the connection between Phantom and this app.');

    const sharedSecretDapp = nacl.box.before(
      bs58.decode(phantom_encryption_public_key!),
      new Uint8Array(Buffer.from(this.sessionKeypair.secretKey))
    );

    const decryptedData = nacl.box.open.after(
      bs58.decode(data),
      bs58.decode(nonce),
      sharedSecretDapp
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

}
