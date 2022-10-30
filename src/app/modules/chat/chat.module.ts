import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';

import { MaterialModule } from '@material/material.module';
import { SharedModule } from '@shared/shared.module';

import { ChatComponent } from './components/chat/chat.component';
import { NewMessageComponent } from './components/new-message/new-message.component';

@NgModule({
  declarations: [
    ChatComponent,
    NewMessageComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MaterialModule,
    SharedModule,
  ]
})
export class ChatModule { }
