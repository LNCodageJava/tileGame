import { Component, OnInit, Input } from '@angular/core';
import { FillTileService } from '../services/fill-tile.service';
import batiments from '../cfg/batiment-colors3.json';

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
    console.log('BatimentIndex', index.innerHTML);
    console.log(`${i}${j}`);
    this.fillTileService.generate('500500', parseInt(index.innerHTML), batiments.pool);
    this.fillTileService.generate(`${400 + i}${j}`, Math.floor(Math.random() * batiments.pool.length), batiments.pool);
  }

  flush() {
    this.fillTileService.generate('4000', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4010', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4001', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4011', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4002', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4003', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4012', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4013', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
  }
}
