import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PhantomRedirectComponent } from './components/phantom-redirect/phantom-redirect.component';

const routes: Routes = [
  { path: 'phantom', component: PhantomRedirectComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedirectsRoutingModule { }
