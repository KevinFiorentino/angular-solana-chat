import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

@Component({
  selector: 'app-phantom-redirect',
  templateUrl: './phantom-redirect.component.html',
  styleUrls: ['./phantom-redirect.component.scss']
})
export class PhantomRedirectComponent implements OnInit {

  public pk?: nacl.BoxKeyPair;
  public pkString?: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(async (params: Params) => {

      });
  }

  setPK(): void {
    this.pk = nacl.box.keyPair();

    const data = {
      publickKey: bs58.encode(this.pk.publicKey),
      privateKey: bs58.encode(this.pk.secretKey)
    }

    this.pkString = JSON.stringify(data);
  }

  phantomConnect(): void {

    /*

    publickKey=
    privateKey=

    phantom_encryption_public_key=
    nonce=
    data=

    HeDn...AL3z

    */

    /* const phantom_encryption_public_key = '59kWXFtBfWdyk6cGhaShGgkfg6HAJJf493m6vDPS1W2E'
    const data = '6SoGJ6a4TZKVyZaUMNNWx9fnya3MPNpRoH4PkGN2kG3taWRgFwNxw5WokiJTmn7c2xKJNoaXS3p6NwxWk7LqTPG2Z8RihuFCr5xXef8kdVSw2MiX8JMfKcbTEJFrQqxSSMbKgpF2KtMHhhNCiJoXjG96HqrhYmmCL5srNj495Xxef3dNFnMo4Q2rWisdrTNpHHAHuoKLTQwHEEUgEoT1oBng7YADQHRywzd2isMM5YzaDkXi29Am8NiKhKciDnqkkh96F1whwHDmhNzb6u4e758sd9kbkxd7UFWXsRcgUzLJqPxhKpTmmoarr6SXCDBb9RM6YekJRSFWt2UJkxaLQ4Nh2rGuMjG1yJ6x29Fqbpzb4ntMhejgirWPPo2p3cZzGVpNyia2EuK76F37BtJUwqAn3ZfTxpF3zNygwANHxD54PY8pGc59hHGv7BcgsS1feHsCj3Cyxw'
    const nonce = 'Dx7WhR457CVZJ5BoxxJWZ31jhHFZHdajh'

    const sharedSecret = bs58.decode('4eJn2aSnEAi7eWQszxqKRQDfS7cBnfxToEpzso4aSxRDknEWTYSPt8P3ftzGswqZUSGUW7Xubam2joQxU6AyuiHp')
    console.log('sharedSecret', sharedSecret)

    const kp = Keypair.fromSecretKey(sharedSecret) */


    /* const sharedSecretDapp = nacl.box.before(
      bs58.decode(phantom_encryption_public_key!),
      kp.secretKey
    );

    console.log('sharedSecretDapp', sharedSecretDapp) */

    /* const decryptedData = nacl.box.open.after(
      bs58.decode(data),
      bs58.decode(nonce),
      sharedSecretDapp
    );

    console.log('decryptedData', decryptedData) */





    if (!this.pk)
      return

    const params = new URLSearchParams();
    params.append('app_url', 'https://angular-solana-chat.vercel.app/');
    params.append('dapp_encryption_public_key', bs58.encode(this.pk.publicKey));
    params.append('redirect_link', 'https://angular-solana-chat.vercel.app?target=_self');
    params.append('cluster', 'devnet');

    window.open(`https://phantom.app/ul/v1/connect?${params.toString()}`);

  }

}
