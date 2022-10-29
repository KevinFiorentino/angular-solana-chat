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
  ) { }

  ngOnInit(): void {
    this.phantom.isConnected();
  }


  async getAllMessages() {
    const messages = await this.phantom.getAllMessages();

    console.log(messages);

    /* console.log(messages[0]);
    console.log(messages[0].publicKey.toString());
    console.log(messages[0].account.owner.toString());
    console.log(messages[0].account.text);
    console.log(messages[0].account.timestamp.toString()); */

  }

  async sendMessage() {
    this.phantom.sendMessage();
  }

}
