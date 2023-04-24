import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
      .subscribe((params: Params) => {

      });
  }

  setPK(): void {
    this.pk = nacl.box.keyPair();

    console.log('PK 1', this.pk)

    const data = {
      publickKey: bs58.encode(this.pk.publicKey),
      privateKey: bs58.encode(this.pk.secretKey)
    }

    const json = JSON.stringify(data)

    console.log('PK 2', json)

    console.log('PK 3', JSON.parse(json))

    console.log('PK 4', data)

    this.pkString = JSON.stringify(data);
  }

  phantomConnect(): void {

    /*

    publickKey=FHs4jGrYzBubjqZ2fHxH1wHNmY4v6r3oGbsskZEgiW35
    privateKey=4JAWZUYwQJ8WhRe6PrnZmGT7cPPnKQ7Bk5qfyuHcuCPH

    phantom_encryption_public_key=9KWwz3fUWtstbPCEu2MihBMo2dKVhyZC9qaDRYWFMwTZ
    nonce=Fc1c7NLzxBS8MESbNBjRGw1bvnLyKJpUc
    data=2ADoUFbVPP5pfanHcKCFNzgvg4Vw51B48Td6qBxdpNp7wCCPCr77HU7YzU38RQCmPiTb1RWkhnGZkp5dA5V3GqwX6AGKKmSorJcy1phwNDhRhWGqE2aN1JTacsPMYKMXZtGsdaWc1hYdoWAwXUKTsaSvzAQcPLkiz7LkY4yzY258LR6wDWd7c4EbvcvmdVfH2v6aWNE7w467dD9DHN2T5URsMAzTK5tFAErEUv13yVZFG46vZPcpSrF3EUsUgDHVCKhCiLYoYU4MYQJAKEN47HFBY45uQzxcj4pMMvCqE671WnkwHPGPGM7Jo6RfJwf1kmCpB66jWNBc5wmorzyE1S8qqowf4yDt2kDkz1R2QTb4gvqAwuqu36Mak2LbnUa6vqcAKFr1iq5NHsZoLjg2n54keVW4DWb2wxviuFGH7YvFuYb9kniRxR3QQRymaEsk5Ksj2J5Ng

    HeDn...AL3z

    */

    const phantom_encryption_public_key = '9KWwz3fUWtstbPCEu2MihBMo2dKVhyZC9qaDRYWFMwTZ'
    const nonce = 'Fc1c7NLzxBS8MESbNBjRGw1bvnLyKJpUc'
    const data = '2ADoUFbVPP5pfanHcKCFNzgvg4Vw51B48Td6qBxdpNp7wCCPCr77HU7YzU38RQCmPiTb1RWkhnGZkp5dA5V3GqwX6AGKKmSorJcy1phwNDhRhWGqE2aN1JTacsPMYKMXZtGsdaWc1hYdoWAwXUKTsaSvzAQcPLkiz7LkY4yzY258LR6wDWd7c4EbvcvmdVfH2v6aWNE7w467dD9DHN2T5URsMAzTK5tFAErEUv13yVZFG46vZPcpSrF3EUsUgDHVCKhCiLYoYU4MYQJAKEN47HFBY45uQzxcj4pMMvCqE671WnkwHPGPGM7Jo6RfJwf1kmCpB66jWNBc5wmorzyE1S8qqowf4yDt2kDkz1R2QTb4gvqAwuqu36Mak2LbnUa6vqcAKFr1iq5NHsZoLjg2n54keVW4DWb2wxviuFGH7YvFuYb9kniRxR3QQRymaEsk5Ksj2J5Ng'

    const sharedSecret = bs58.decode('4JAWZUYwQJ8WhRe6PrnZmGT7cPPnKQ7Bk5qfyuHcuCPH')

    const sharedSecretDapp = nacl.box.before(
      bs58.decode(phantom_encryption_public_key!),
      sharedSecret
    );

    const decryptedData = nacl.box.open.after(
      bs58.decode(data),
      bs58.decode(nonce),
      sharedSecretDapp
    );

    if (!decryptedData)
      return

    console.log('decryptedData', JSON.parse(Buffer.from(decryptedData).toString('utf8')))





    /* if (!this.pk)
      return

    const params = new URLSearchParams();
    params.append('app_url', 'https://angular-solana-chat.vercel.app/');
    params.append('dapp_encryption_public_key', bs58.encode(this.pk.publicKey));
    params.append('redirect_link', 'https://angular-solana-chat.vercel.app?target=_self');
    params.append('cluster', 'devnet');

    window.open(`https://phantom.app/ul/v1/connect?${params.toString()}`); */

  }

}
