import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.scss'],
})
export class BandeauComponent implements OnInit {
  @Input() player: any;
  @Input() tuileActive: any;

  gridSizeX = Array.from(Array(2).keys());
  gridSizeY = Array.from(Array(4).keys());
  constructor() {}

  ngOnInit(): void {}

  hexClick(i: any, j: any) {}
}
