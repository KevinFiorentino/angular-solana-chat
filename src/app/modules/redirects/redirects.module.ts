import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RedirectsRoutingModule } from './redirects-routing.module';
import { PhantomRedirectComponent } from './components/phantom-redirect/phantom-redirect.component';

@NgModule({
  declarations: [
    PhantomRedirectComponent
  ],
  imports: [
    CommonModule,
    RedirectsRoutingModule
  ]
})
export class RedirectsModule { }
