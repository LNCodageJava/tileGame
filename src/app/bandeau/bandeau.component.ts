import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.scss'],
})
export class BandeauComponent implements OnInit {
  @Input() counterAdjTiles: number = 0;
  @Input() counterPoints: number = 0;
  @Input() counterTotalTiles: number = 0;
  constructor() {}

  ngOnInit(): void {}
}
