import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@material/material.module';

import { NavBarComponent } from './components/nav-bar/nav-bar.component';

const COMPONENTS = [
  NavBarComponent
]

@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    COMPONENTS
  ],
  providers: []
})
export class SharedModule { }
