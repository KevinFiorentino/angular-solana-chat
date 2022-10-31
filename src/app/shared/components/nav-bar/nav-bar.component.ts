import { Component, OnInit } from '@angular/core';
import { PhantomConnectService } from '@shared/services/phantom-connect.service';
import { UtilsService } from '@shared/services/utils.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public walletAddress!: string;

  constructor(
    public utils: UtilsService,
    private phantom: PhantomConnectService,
  ) { }

  ngOnInit(): void {
    this.phantom.listenPublicKey
      .subscribe(pk => {
        this.walletAddress = pk ? pk.toString() : '';
      });

    this.phantom.walletConnectAutomatically();
  }

  walletConnect() {
    this.phantom.walletConnect();
  }

  walletDisconnect() {
    this.phantom.walletDisconnect();
  }

}
