import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HexComponent } from './hex/hex.component';
import { HostListenerDirective } from './directives/host-listener.directive';

@NgModule({
  declarations: [AppComponent, HexComponent, HostListenerDirective],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
