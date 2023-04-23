import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

@Component({
  selector: 'app-phantom-redirect',
  templateUrl: './phantom-redirect.component.html',
  styleUrls: ['./phantom-redirect.component.scss']
})
export class PhantomRedirectComponent implements OnInit {

  public pk?: Keypair;
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
    this.pk = new Keypair();

    const data = {
      publickKey: this.pk.publicKey.toString(),
      privateKey: JSON.stringify(bs58.encode(this.pk.secretKey))
    }

    this.pkString = JSON.stringify(data);
  }

  phantomConnect(): void {

    // JSON.stringify(bs58.encode(pk.secretKey))

    if (!this.pk)
      return

    const params = new URLSearchParams();
    params.append('app_url', 'https://angular-solana-chat.vercel.app/');
    params.append('dapp_encryption_public_key', this.pk.publicKey.toString());
    params.append('redirect_link', 'https://angular-solana-chat.vercel.app?target=_self');
    params.append('cluster', 'devnet');

    window.open(`https://phantom.app/ul/v1/connect?${params.toString()}`);
  }

}
