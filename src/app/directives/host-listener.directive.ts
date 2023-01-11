import { Directive, HostListener } from '@angular/core';
import { TileService } from '../services/tile.service';

@Directive({
  selector: '[appHostListener]',
})
export class HostListenerDirective {
  currentTile: any;
  bandeau: any;
  constructor(private tileService: TileService) {
    this.currentTile = document.getElementById('currentTile');
    this.bandeau = document.getElementById('bandeau');
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMouve(event: MouseEvent) {
    this.currentTile.style.left = `${event.pageX}px`;
    this.currentTile.style.top = `${event.pageY}px`;
    console.log(event.pageX);
    console.log(event.pageY);
    if (event.pageX < 159 || (event.pageX > document.documentElement.clientWidth - 100 && event.pageY < 80)) {
      this.currentTile.style.visibility = 'hidden';
    } else {
      this.currentTile.style.visibility = 'visible';
    }

    // this.bandeau.style.left = `${event.pageX}px`;
    // this.bandeau.style.top = `${event.pageY}px`;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    let myWindow = document.getElementById('all');
    if (myWindow) {
      myWindow.style.height = `${document.documentElement.clientHeight}px`;
      myWindow.style.width = `${document.documentElement.clientWidth}px`;
    }
  }
}
