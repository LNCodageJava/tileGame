import { Component, OnInit, Input } from '@angular/core';
import { FillTileService } from '../services/fill-tile.service';
import batiments from '../cfg/batiment-colors3.json';
import { TileService } from '../services/tile.service';
import { GlobalStore } from '../store/global.store';
import { StateKeys } from '../store/global.state';

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.scss'],
})
export class BandeauComponent implements OnInit {
  @Input() player: any;
  @Input() tuileActive: any;
  r: any = {
    w1: 0,
    g1: 0,
    s1: 0,
    r1: 0,
    w2: 0,
    g2: 0,
    s2: 0,
    r2: 0,
  };

  gridSizeX = Array.from(Array(3).keys());
  gridSizeY = Array.from(Array(4).keys());
  constructor(private fillTileService: FillTileService, private tileservice: TileService, private store: GlobalStore) {}

  ngOnInit(): void {}

  hexClick(i: any, j: any) {
    var index = document.getElementById(`${400 + i}${j}_index`) as HTMLElement;
    if (i == 2) {
      this.fillTileService.generate('500500', parseInt(index.innerHTML.slice(1)), batiments.wonder);
      this.fillTileService.generate(
        `${400 + i}${j}`,
        Math.floor(Math.random() * batiments.wonder.length),
        batiments.wonder
      );
    } else {
      this.fillTileService.generate('500500', parseInt(index.innerHTML.slice(1)), batiments.pool);
      this.fillTileService.generate(
        `${400 + i}${j}`,
        Math.floor(Math.random() * batiments.pool.length),
        batiments.pool
      );
    }
  }

  flush() {
    this.fillTileService.generate('4000', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4010', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4001', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4011', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4002', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4012', Math.floor(Math.random() * batiments.pool.length), batiments.pool);

    this.fillTileService.generate('4020', Math.floor(Math.random() * batiments.wonder.length), batiments.wonder);
    this.fillTileService.generate('4021', Math.floor(Math.random() * batiments.wonder.length), batiments.wonder);
    this.fillTileService.generate('4022', Math.floor(Math.random() * batiments.wonder.length), batiments.wonder);

    this.fillTileService.generate('4003', Math.floor(Math.random() * batiments.market.length), batiments.market);
    this.fillTileService.generate('4013', Math.floor(Math.random() * batiments.market.length), batiments.market);
    this.fillTileService.generate('4023', Math.floor(Math.random() * batiments.market.length), batiments.market);
  }

  moins(a: any) {
    this.r[a] = this.r[a] - 1;
  }

  plus(a: any) {
    this.r[a] = this.r[a] + 1;
  }

  remove() {
    this.store.set(StateKeys.MODE, 'remove');
    this.fillTileService.generate('500500', 0, batiments.empty);
  }

  move() {
    this.store.set(StateKeys.MODE, 'deplacer1');
    this.fillTileService.generate('500500', 0, batiments.empty);
  }
}
