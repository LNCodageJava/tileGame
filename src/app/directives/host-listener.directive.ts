import { Directive, HostListener } from '@angular/core';
import { TileService } from '../services/tile.service';

@Directive({
  selector: '[appHostListener]',
})
export class HostListenerDirective {
  currentTile: any;
  constructor(private tileService: TileService) {
    this.currentTile = document.getElementById('currentTile');
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMouve(event: MouseEvent) {
    this.currentTile.style.left = `${event.pageX}px`;
    this.currentTile.style.top = `${event.pageY}px`;
  }
}
