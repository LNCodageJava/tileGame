import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HexComponent } from './hex/hex.component';
import { HostListenerDirective } from './directives/host-listener.directive';
import { BandeauComponent } from './bandeau/bandeau.component';
import { DiceComponent } from './dice/dice.component';

@NgModule({
  declarations: [AppComponent, HexComponent, HostListenerDirective, BandeauComponent, DiceComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
