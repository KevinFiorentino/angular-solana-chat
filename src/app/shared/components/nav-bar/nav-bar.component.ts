import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PhantomConnectService } from '@shared/services/phantom-connect.service';
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
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.phantom.listenPublicKey
      .subscribe(pk => {
        this.walletAddress = pk ? pk.toString() : '';
        this.truncatedAddress = this.utils.truncatedAddress(this.walletAddress);
        // this.cdr.detectChanges();
      });

    /* this.phantom.walletConnectAutomatically(); */
  }

  walletConnect() {
    this.phantom.walletConnect();
  }

  walletDisconnect() {
    this.phantom.walletDisconnect();
  }

}
