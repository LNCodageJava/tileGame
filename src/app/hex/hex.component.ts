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
  @Input() batiment: any;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    console.log(`${this.hHex}${this.vHex}`);
    var t = document.getElementById(`${this.hHex}${this.vHex}`);
    if (t && this.vHex % 2 !== 0 && this.hHex === 0) {
      // décalage colonnes impaires
      t.style.marginLeft = '61px';
    }
  }

  // hexClick() {
  //   console.log(`clic${this.hHex}${this.vHex}`);
  // }
}
