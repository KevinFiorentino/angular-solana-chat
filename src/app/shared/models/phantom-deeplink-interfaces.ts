export interface KeypairEncoded {
  publicKey: string;
  secretKey: string;
}

export interface PhantomSessionData {
  keypair: KeypairEncoded;
  session: string | undefined;
  nonce: string | undefined;
}

export interface PhantomDeeplinkConnection {
  public_key: string;
  session: string;
}
