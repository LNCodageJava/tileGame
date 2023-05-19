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
  @Input() logos: any;
  @Input() pointsLogo: any;
  @Input() points: any;
  @Input() power: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    var t = document.getElementById(`${this.hHex}${this.vHex}`);
    if (t && this.vHex % 2 !== 0 && this.hHex === 0) {
      // décalage colonnes impaires
      t.style.marginLeft = `${TUILE_WIDTH * 1.52}px`;
    }
  }
}
