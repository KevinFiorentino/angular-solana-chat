import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@material/material.module';
import { SharedModule } from '@shared/shared.module';

import { ChatComponent } from './components/chat/chat.component';
import { NewMessageComponent } from './components/new-message/new-message.component';
import { UpdateMessageComponent } from './components/update-message/update-message.component';

@NgModule({
  declarations: [
    ChatComponent,
    NewMessageComponent,
    UpdateMessageComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
  ]
})
export class ChatModule { }
