import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponentsRoutingModule } from './shared-components-routing.module';
import { AppShellComponent } from './app-shell/app-shell.component';


@NgModule({
  declarations: [
    AppShellComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsRoutingModule
  ]
})
export class SharedComponentsModule { }
