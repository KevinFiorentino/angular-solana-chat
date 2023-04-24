import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PhantomConnectService } from '@shared/services/phantom/phantom-connect.service';
import { PhantomDeeplinkService } from '@shared/services/phantom/phantom-deeplink.service';
import { UtilsService } from '@shared/services/utils.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {

  public walletAddress!: string;
  public truncatedAddress!: string;

  constructor(
    public utils: UtilsService,
    private phantom: PhantomConnectService,
    private phantomDeeplink: PhantomDeeplinkService,
  ) { }

  ngOnInit(): void {
    this.phantom.listenPublicKey
      .subscribe(pk => {
        this.walletAddress = pk ? pk.toString() : '';
        this.truncatedAddress = this.utils.truncatedAddress(this.walletAddress);
      });
  }

  walletConnect() {
    const isMobile = this.phantomDeeplink.isMobileDevice()
    if (isMobile)
      this.phantomDeeplink.walletConnect();
    else
      this.phantom.walletConnect();
  }

  walletDisconnect() {
    this.phantom.walletDisconnect();
  }

}
