import { Component, OnInit } from '@angular/core';
import { PhantomConnectService } from '@shared/services/phantom-connect.service';
import { UtilsService } from '@shared/services/utils.service';
import { NewMessageComponent } from '@modules/chat/components/new-message/new-message.component';
import { PublicKey } from '@solana/web3.js';
import { format } from 'date-fns';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss']
})
export class MyMessagesComponent implements OnInit {

  public messages!: any;
  public walletAddress!: string;

  constructor(
    public utils: UtilsService,
    private phantom: PhantomConnectService,
  ) { }

  ngOnInit(): void {
    this.phantom.listenPublicKey
      .subscribe(async (pk: PublicKey | null) => {
        this.walletAddress = pk ? pk.toString() : '';
        if (this.walletAddress) {
          this.messages = await this.phantom.getMessagesByWalletAddress(this.walletAddress);
          console.log(this.messages)
        }
      });
  }

  cutAddress(address: string): string {
    return this.utils.truncatedAddress(address);
  }

  getDate(date: string): string {
    return format(new Date(1666970458 * 1000), 'MM/d/yyyy hh:mm');
  }

}
