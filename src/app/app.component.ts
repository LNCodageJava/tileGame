import { Component, HostListener, OnInit } from '@angular/core';
import { TileService } from './services/tile.service';
import parameters from './cfg/app.parameters.json';
import batiments from './cfg/batiment-colors-2.json';
import { BatimentDto } from './dto/batimentDto';
import { TuileDto } from './dto/tuileDto';
import { GlobalStore } from './store/global.store';
import { StateKeys } from './store/global.state';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private tileService: TileService, private store: GlobalStore) {}
  title = 'tileGame';
  logos: string[] = [];
  pointsLogo: string = '';
  points = '';
  power = '';
  TILE_NUMBER = 0;

  gridSizeX = Array.from(Array(10).keys());
  gridSizeY = Array.from(Array(20).keys());

  ngOnInit(): void {}

  nextimage() {
    this.TILE_NUMBER += 1;
    if (this.TILE_NUMBER === batiments.batiments.length) {
      this.TILE_NUMBER = 0;
    }
    this.generate();
  }

  ngAfterViewInit(): void {
    this.resizeWindow();
    this.generate();
  }

  generate() {
    console.log('generation de la tuile:' + this.TILE_NUMBER);
    this.setTuileData(
      '11',
      batiments.batiments[this.TILE_NUMBER].name,
      batiments.batiments[this.TILE_NUMBER].color,
      batiments.batiments[this.TILE_NUMBER].points,
      batiments.batiments[this.TILE_NUMBER].cost,
      batiments.batiments[this.TILE_NUMBER].power
    );
  }

  setTuileData(idTuile: string, batiment: string, color: string, points: string, cost: string, power: string) {
    var img = document.getElementById(`${idTuile}_batiment`) as HTMLImageElement;
    img.src = `assets/batiments/${batiment}.png`;

    var img = document.getElementById(`${idTuile}_couleur`) as HTMLImageElement;
    img.src = `assets/textures/${color}.png`;

    this.setCost(cost);
    this.setPoints(points);

    this.power = power;

    if (points.slice(0, 1) === 'i') {
      console.log(this.TILE_NUMBER + 'black');
      var ele = document.getElementById(`points-wrapper`) as HTMLElement;
      ele.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.7);color: white');
      if (this.pointsLogo === 'fulllogo') {
        document.getElementById(`points-logo`)?.setAttribute('style', 'filter:  brightness(0) invert(1);');
      } else {
        document.getElementById(`points-logo`)?.setAttribute('style', 'filter:unset)');
      }
      var ele = document.getElementById(`power-wrapper`) as HTMLElement;
      ele.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.7);color: black');
      console.log('1', power);
      if (power === 'deplacer' || power === 'copier') {
        console.log('2', power);
        document.getElementById(`power`)?.setAttribute('style', 'filter:  brightness(0) invert(1);');
      } else {
        document.getElementById(`power`)?.setAttribute('style', 'filter:unset)');
      }
      var ele = document.getElementById(`wrapper`) as HTMLElement;
      ele.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.7);color: black');
    } else {
      var ele = document.getElementById(`points-wrapper`) as HTMLElement;
      ele.setAttribute('style', 'background-color: rgba(255, 255, 255, 0.7);color: black');
      if (this.pointsLogo === 'fulllogo') {
        document.getElementById(`points-logo`)?.setAttribute('style', 'filter:  brightness(0)');
      } else {
        document.getElementById(`points-logo`)?.setAttribute('style', 'filter:unset)');
      }
      var ele = document.getElementById(`power-wrapper`) as HTMLElement;
      ele.setAttribute('style', 'background-color: rgba(255, 255, 255, 0.7);color: black');
      if (power === 'deplacer' || power === 'copier') {
        document.getElementById(`power`)?.setAttribute('style', 'filter:  brightness(0)');
      } else {
        document.getElementById(`power`)?.setAttribute('style', 'filter:unset)');
      }
      var ele = document.getElementById(`wrapper`) as HTMLElement;
      ele.setAttribute('style', 'background-color: rgba(255, 255, 255, 0.7);color: black');
    }
  }

  setCost(cost: string) {
    this.logos = [];
    if (cost.slice(0, 1) === 'a') {
      let nb = cost.slice(1, 2);
      for (let i = 0; i < parseInt(nb); i++) {
        let random = this.takeRandomElementFromArray(['waterlogo', 'leaflogo', 'sandlogo']);
        this.fillArray('1', random);
      }
    } else {
      let nbWaterLogo = cost.slice(0, 1);
      this.fillArray(nbWaterLogo, 'waterlogo');
      let nbLeafLogo = cost.slice(1, 2);
      this.fillArray(nbLeafLogo, 'leaflogo');
      let nbSandLogo = cost.slice(2, 3);
      this.fillArray(nbSandLogo, 'sandlogo');
    }
  }

  setPoints(points: string) {
    let pointLogo = points.slice(2, 3);
    switch (pointLogo) {
      case 'a':
        this.pointsLogo = 'allylogo';
        break;
      case 'e':
        this.pointsLogo = 'foelogo';
        break;
      case 'w':
        this.pointsLogo = 'waterlogo';
        break;
      case 's':
        this.pointsLogo = 'sandlogo';
        break;
      case 'g':
        this.pointsLogo = 'leaflogo';
        break;
      case 'f':
        this.pointsLogo = 'fulllogo';
        break;
    }
    this.points = points.slice(1, 2);
  }

  takeRandomElementFromArray(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  fillArray(nb: string, elementName: string) {
    for (let i = 0; i < parseInt(nb); i++) {
      this.logos.push(elementName);
    }
  }

  resizeWindow() {
    let myWindow = document.getElementById('all');
    if (myWindow) {
      myWindow.style.height = `${document.documentElement.clientHeight}px`;
      myWindow.style.width = `${document.documentElement.clientWidth}px`;
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'p') {
      this.nextimage();
    }
  }
}
