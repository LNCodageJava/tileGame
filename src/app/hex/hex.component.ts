import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hex',
  templateUrl: './hex.component.html',
  styleUrls: ['./hex.component.scss'],
})
export class HexComponent implements OnInit, AfterViewInit {
  id = '13';
  @Input() vHex: any;
  @Input() hHex: any;
  batiment: any = 'no-image';
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    var t = document.getElementById(`${this.hHex}${this.vHex}`);
    if (t && this.vHex % 2 !== 0 && this.hHex === 0) {
      // décalage colonnes impaires
      t.style.marginLeft = '61px';
    }
  }
}
