import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { AppShellComponent } from './app-shell/app-shell.component';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { AccountModule } from "../modules/account/account.module";


@NgModule({
  declarations: [
    AppShellComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatButtonToggleModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    AccountModule
],
  exports: [
    AppShellComponent
  ]
})
export class SharedModule { }
