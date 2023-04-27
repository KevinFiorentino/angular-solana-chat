export interface KeypairEncoded {
  publicKey: string;
  secretKey: string;
}

export interface PhantomSessionData {
  keypair: KeypairEncoded;
  userPublicKey: string;
  phantomEncryptionPublicKey: string | undefined;
  session: string | undefined;
  nonce: string | undefined;      // Each interaction with Phantom generate a new nonce. This is the connection's nonce.
}

export interface PhantomDeeplinkConnection {
  public_key: string;
  session: string;
}

export interface PhantomDeeplinkSignAndSend {
  signature: string;
}
