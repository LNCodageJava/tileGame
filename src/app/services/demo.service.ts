import { Injectable } from '@angular/core';
import { BatimentDto } from '../dto/batimentDto';
import { FillTileService } from './fill-tile.service';

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  i = 1;
  j = 0;

  constructor(private fillTileService: FillTileService) {}

  fillDemoMode(batiments: any) {
    batiments.pool.forEach((_: any, index: any) =>
      this.fillTileService.generate(this.calculateIdPrint(index), index, batiments.pool)
    );
    batiments.pool.forEach((_: any, index: any) =>
      this.fillTileService.generate(this.calculateIdPrint(index), index, batiments.wonder)
    );
    // batiments?.hand?.forEach((_: any, index: any) =>
    //   this.fillTileService.generate(this.calculateIdPrint(index + batiments.pool.length), index, batiments.hand)
    // );
    // batiments?.obj?.forEach((_: any, index: any) =>
    //   this.fillTileService.generate(
    //     this.calculateIdPrint(index + batiments.pool.length + batiments.hand.length),
    //     index,
    //     batiments.obj
    //   )
    // );
  }

  calculateIdPrint(index: number) {
    this.j = this.j + 1;
    let x = 3;
    if (index === 0 || index % x == 0) {
      this.i = this.i + 1;
      this.j = 0;
    }
    console.log(`${this.i}${this.j}`);
    return `${this.i}${this.j}`;
  }
}
