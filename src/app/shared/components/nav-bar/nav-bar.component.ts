import { Component, OnInit } from '@angular/core';
import { PhantomConnectService } from '@shared/services/phantom-connect.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(
    private phantom: PhantomConnectService
  ) { }

  ngOnInit(): void {}

  connectWallet() {
    this.phantom.connect();
  }

  disconnectWallet() {
    this.phantom.disconnect();
  }

}
