import { Component, OnInit } from '@angular/core';
import { ChatProgramService } from '@shared/services/solana-contracts/chat-program.service';
import { PhantomConnectService } from '@shared/services/phantom/phantom-connect.service';
import { UtilsService } from '@shared/services/utils.service';
import { NewMessageComponent } from '@modules/chat/components/new-message/new-message.component';
import { MatDialog } from '@angular/material/dialog';
import { PublicKey } from '@solana/web3.js';
import { format } from 'date-fns';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public messages!: any;
  public walletAddress!: string;
  public loading = true;

  constructor(
    public utils: UtilsService,
    private dialog: MatDialog,
    private phantom: PhantomConnectService,
    private chatProgram: ChatProgramService,
  ) { }

  ngOnInit(): void {
    this.getAllMessages();
  }

  getAllMessages(): void {
    this.loading = true;
    this.phantom.listenPublicKey
      .subscribe(async (pk: PublicKey | null) => {
        this.walletAddress = pk ? pk.toString() : '';
        if (this.walletAddress) {
          this.messages = await this.chatProgram.getAllMessages();
          this.messages = this.utils.sortMessages(this.messages);
          this.loading = false;
        }
      });
  }

  cutAddress(address: string): string {
    return this.utils.truncatedAddress(address);
  }

  getDate(date: number): string {
    return format(new Date(date * 1000), 'MM/d/yyyy hh:mm');
  }

  sendNewMessage(): void {
    this.dialog.open(NewMessageComponent, {
      data: {
        callback: this.callbackNewMessage.bind(this)
      }
    });
  }

  async callbackNewMessage() {
    // Update all messages
    this.messages = await this.chatProgram.getAllMessages();        // TODO: Improve performance
    this.messages = this.utils.sortMessages(this.messages);
  }

}
