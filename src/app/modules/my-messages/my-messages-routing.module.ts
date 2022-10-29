import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyMessagesComponent } from './components/my-messages/my-messages.component';

const routes: Routes = [
  { path: '', component: MyMessagesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyMessagesRoutingModule { }
