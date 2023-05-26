import { Component, OnInit, Input } from '@angular/core';
import { FillTileService } from '../services/fill-tile.service';
import batiments from '../cfg/batiment-colors.json';

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
  constructor(private fillTileService: FillTileService) {}

  ngOnInit(): void {}

  hexClick(i: any, j: any) {
    var index = document.getElementById(`${400 + i}${j}_index`) as HTMLElement;
    console.log(`${400 + i}${j}`);
    if (j == 0) {
      this.fillTileService.generate('500500', parseInt(index.innerHTML.slice(1)), batiments.pool);
      this.fillTileService.generate(
        `${400 + i}${j}`,
        Math.floor(Math.random() * batiments.pool.length),
        batiments.pool
      );
    } else {
      this.fillTileService.generate('500500', parseInt(index.innerHTML.slice(1)), batiments.hand);
      this.fillTileService.generate(
        `${400 + i}${j}`,
        Math.floor(Math.random() * batiments.hand.length),
        batiments.hand
      );
    }
  }
}
