import { Component, OnInit } from '@angular/core';
import { ChatProgramService } from '@shared/services/chat-program.service';
import { PhantomConnectService } from '@shared/services/phantom/phantom-connect.service';
import { UtilsService } from '@shared/services/utils.service';
import { UpdateMessageComponent } from '@modules/chat/components/update-message/update-message.component';
import { MatDialog } from '@angular/material/dialog';
import { PublicKey } from '@solana/web3.js';
import { format } from 'date-fns';
import { SolanaChat } from '@shared/idls/solana-chat.idl';
import { ProgramAccount, IdlTypes }from '@project-serum/anchor';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss']
})
export class MyMessagesComponent implements OnInit {

  public messages!: any;
  public walletAddress!: string;
  public loading = true;

  constructor(
    public utils: UtilsService,
    private dialog: MatDialog,
    private phantom: PhantomConnectService,
    private chatProgram: ChatProgramService
  ) { }

  ngOnInit(): void {
    this.getMessagesByWalletAddress();
  }

  getMessagesByWalletAddress(): void {
    this.loading = true;
    this.phantom.listenPublicKey
      .subscribe(async (pk: PublicKey | null) => {
        this.walletAddress = pk ? pk.toString() : '';
        if (this.walletAddress) {
          this.messages = await this.chatProgram.getMessagesByWalletAddress(this.walletAddress);
          this.messages = this.utils.sortMessages(this.messages);

          console.log('this.messages', this.messages)

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

  editMessage(msg: ProgramAccount<IdlTypes<SolanaChat>>): void {
    this.dialog.open(UpdateMessageComponent, {
      data: {
        msg: msg,
        callback: this.callbackUpdMessages.bind(this)
      }
    });
  }

  deleteMessage(msg: ProgramAccount<IdlTypes<SolanaChat>>): void {
    this.chatProgram.deleteMessage(msg.publicKey)
      .then(txId => {
        console.log(`Transaction ID: ${txId}`);
        this.callbackUpdMessages();
      });
  }

  async callbackUpdMessages() {
    // Update all messages
    this.messages = await this.chatProgram.getMessagesByWalletAddress(this.walletAddress);        // TODO: Improve performance
    this.messages = this.utils.sortMessages(this.messages);
  }

}
