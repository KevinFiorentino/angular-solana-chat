import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

const MODULES = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MODULES
  ],
  exports: [
    MODULES
  ],
  providers: []
})
export class MaterialModule { }
