import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PhantomDeeplinkService } from '@shared/services/phantom/phantom-deeplink.service';

@Component({
  selector: 'app-phantom-redirect',
  templateUrl: './phantom-redirect.component.html',
  styleUrls: ['./phantom-redirect.component.scss']
})
export class PhantomRedirectComponent implements OnInit {

  public txId?: string;

  public errorCode?: string;
  public errorMessage?: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private phantomDeeplink: PhantomDeeplinkService
  ) { }

  ngOnInit(): void {
    const method = this.route.snapshot.paramMap.get('method');

    if (!method) {
      this.router.navigate(['/']);
      return
    }

    this.route.queryParams
      .subscribe((params: Params) => {
        if (!params.errorCode && !params.errorMessage)
          setTimeout(() => { this.checkTypeRedirect(method, params); }, 0);
        else {
          this.errorCode = params.errorCode;
          this.errorMessage = params.errorMessage;
        }
      });
  }

  checkTypeRedirect(method: string, params: Params) {
    switch (method) {
      case 'connect' : {
        this.onConnect(params);
      };break;
      case 'disconnect' : {
        this.onDisconnect();
      };break;
      case 'signAndSendTransaction' : {
        this.onSignAndSendTransaction(params);
      };break;
      case 'signMessage' : {
        this.onSignMessage(params);
      };break;
      default : {
        throw new Error('Error: the method is not available.');
      }
    }
  }


  onConnect(params: Params): void {
    // https://docs.phantom.app/phantom-deeplinks/provider-methods/connect

    const phantomEncryptionPublicKey = params.phantom_encryption_public_key;
    const nonce = params.nonce;
    const data = params.data;

    if (!phantomEncryptionPublicKey || !nonce || !data)
      throw new Error('Error: missing parameters in method onConnect');

    this.phantomDeeplink.walletConnectRedirect(
      phantomEncryptionPublicKey,
      nonce,
      data,
    );

    this.router.navigate(['/chat']);
  }

  onDisconnect(): void {
    // https://docs.phantom.app/phantom-deeplinks/provider-methods/disconnect
    // It is necessary do nothing.
    this.router.navigate(['/chat']);
  }

  onSignAndSendTransaction(params: Params): void {
    // https://docs.phantom.app/phantom-deeplinks/provider-methods/signandsendtransaction

    const nonce = params.nonce;
    const data = params.data;

    if (!nonce || !data)
      throw new Error('Error: missing parameters in method onSignAndSendTransaction');

    const txId = this.phantomDeeplink.signAndSendTransactionRedirect(
      nonce,
      data,
    );

    // Depending the action, it will be necessary redirect the user to diferents pages
    // Here, we only show the transaction ID on the HTML
    this.txId = txId;
  }

  onSignMessage(params: Params): void {
    // https://docs.phantom.app/phantom-deeplinks/provider-methods/signmessage
  }

}
