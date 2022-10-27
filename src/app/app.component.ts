import { Component, OnInit } from '@angular/core';
import { PhantomConnectService } from '@shared/services/phantom-connect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private phantom: PhantomConnectService
  ) {}

  ngOnInit(): void {
    this.phantom.isConnected();
  }

  connectWallet() {
    this.phantom.connect();
  }

  disconnectWallet() {
    this.phantom.disconnect();
  }

  async getAllMessages() {
    const messages = await this.phantom.getAllMessages();
    console.log(messages);
  }

  async sendMessage() {
    this.phantom.sendMessage();
  }

}
