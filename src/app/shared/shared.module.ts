import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@material/material.module';

const ANGULAR_MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
];

const CUSTOM_MODULES = [
  MaterialModule,
];

@NgModule({
  declarations: [],
  imports: [
    ANGULAR_MODULES,
    CUSTOM_MODULES,
  ],
  exports: [],
  providers: []
})
export class SharedModule { }
