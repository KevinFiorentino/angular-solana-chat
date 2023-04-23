import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'chat',
    loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule),
  },
  {
    path: 'my-messages',
    loadChildren: () => import('./modules/my-messages/my-messages.module').then(m => m.MyMessagesModule),
  },
  {
    path: 'redirect',
    loadChildren: () => import('./modules/redirects/redirects.module').then(m => m.RedirectsModule),
  },
  {
    path: '',
    loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule),
  },
  {
    path: '**',
    redirectTo: 'chat'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
