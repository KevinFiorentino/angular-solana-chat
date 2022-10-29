import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyMessagesRoutingModule } from './my-messages-routing.module';

import { MaterialModule } from '@material/material.module';
import { SharedModule } from '@shared/shared.module';

import { MyMessagesComponent } from './components/my-messages/my-messages.component';

@NgModule({
  declarations: [
    MyMessagesComponent
  ],
  imports: [
    CommonModule,
    MyMessagesRoutingModule,
    MaterialModule,
    SharedModule,
  ]
})
export class MyMessagesModule { }
