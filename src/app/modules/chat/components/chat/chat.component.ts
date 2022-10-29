import { Component, OnInit } from '@angular/core';
import { PhantomConnectService } from '@shared/services/phantom-connect.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(
    private phantom: PhantomConnectService
  ) { }

  ngOnInit(): void {}

  async getAllMessages() {
    const messages = await this.phantom.getAllMessages();

    console.log(messages);

    /* console.log(messages[0]);
    console.log(messages[0].publicKey.toString());
    console.log(messages[0].account.owner.toString());
    console.log(messages[0].account.text);
    console.log(messages[0].account.timestamp.toString()); */

  }

}
