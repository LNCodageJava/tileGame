import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
const TUILE_WIDTH = 60;
@Component({
  selector: 'app-hex',
  templateUrl: './hex.component.html',
  styleUrls: ['./hex.component.scss'],
})
export class HexComponent implements OnInit, AfterViewInit {
  @Input() vHex: any;
  @Input() hHex: any;
  batiment: any = 'no-image';

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  @Input() logos: any;
  @Input() pointsLogo: any;
  @Input() points: any = 0;
  @Input() power: any;
}
