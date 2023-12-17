import { Component, HostListener, OnInit } from '@angular/core';
import { TileService } from './services/tile.service';
import parameters from './cfg/app.parameters.json';
import batiments from './cfg/batiment-colors3.json';
import { BatimentDto } from './dto/batimentDto';
import { TuileDto } from './dto/tuileDto';
import { GlobalStore } from './store/global.store';
import { StateKeys } from './store/global.state';
import { FillTileService } from './services/fill-tile.service';
import { DemoService } from './services/demo.service';
const COUNTER_ADJ_START = 9;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private tileService: TileService,
    private store: GlobalStore,
    private fillTileService: FillTileService,
    private demoService: DemoService
  ) {}
  title = 'tileGame';

  gridSizeX = Array.from(Array(25).keys());
  gridSizeY = Array.from(Array(10).keys());

  counterAdjTiles = 0;
  counterPoints = 0;
  counterTotalTiles = 0;
  mode = 'normal';
  rotate = 0;
  demoMode = 'no';
  displayIndex = 0;

  player1 = {
    id: 1,
    nom: 'Scratch',
    active: true,
    counterAdjTiles: COUNTER_ADJ_START,
    counterPoints: 0,
    color: '#A6035D',
  };

  player2 = {
    id: 2,
    nom: 'LNC',
    active: false,
    counterAdjTiles: COUNTER_ADJ_START,
    counterPoints: 0,
    color: '#F28705',
  };

  playerActive = 1;
  tuileActive = 1;
  previousTileId = '';
  currentTuile: TuileDto = { batimentName: '', colors: [] };

  logos: string[] = [];
  pointsLogo: string = '';
  points = '0';
  power = '';

  ngOnInit(): void {
    this.store.select(StateKeys.MODE).subscribe((mode) => {
      this.mode = mode;
      console.log('Mode: ', mode);
      if (mode === 'nextTurn') {
        this.endturn();
        this.startTurn();
      }
    });
  }

  ngAfterViewInit(): void {
    this.resizeWindow();
    this.startTurn();
    this.fillHandRandomTiles();

    if (this.demoMode === 'PRINT') {
      this.fillTileService.generate('00', this.displayIndex, batiments.pool);
    } else if (this.demoMode === 'ALL') {
      this.demoService.fillDemoMode(batiments);
    } else {
      this.fillTuileDepart();
    }
  }

  resizeWindow() {
    let myWindow = document.getElementById('all');
    if (myWindow) {
      myWindow.style.height = `${document.documentElement.clientHeight}px`;
      myWindow.style.width = `${document.documentElement.clientWidth}px`;
    }
  }

  fillTuileDepart(): void {
    let colors = ['w', 'g', 's'];

    let c0 = this.takeRandomElementFromArray(colors);
    var img = document.getElementById(`74_couleur`) as HTMLImageElement;
    img.src = `assets/textures/${c0}.png`;

    let c1 = this.takeRandomElementFromArray(colors);
    colors = colors.filter((element) => element !== c1);
    var img = document.getElementById(`63_couleur`) as HTMLImageElement;
    img.src = `assets/textures/${c1}.png`;

    let c2 = this.takeRandomElementFromArray(colors);
    colors = colors.filter((element) => element !== c2);
    var img = document.getElementById(`65_couleur`) as HTMLImageElement;
    img.src = `assets/textures/${c2}.png`;

    let c3 = this.takeRandomElementFromArray(colors);
    var img = document.getElementById(`54_couleur`) as HTMLImageElement;
    img.src = `assets/textures/${c3}.png`;

    // var img = document.getElementById(`74_couleur`) as HTMLImageElement;
    // img.src = `assets/textures/w.png`;

    this.tileService.findTuilesAdjacentes(5, 10);
    this.counterAdjTiles = this.tileService.createTuileBlancheAndReturnCost() + COUNTER_ADJ_START;
  }

  takeRandomElementFromArray(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  shuffle(array: any[]) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  }

  fillHandRandomTiles() {
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

  /**
   * remplir le hex cliqué avec le hex courant
   * @param hHex
   * @param vHex
   */
  hexClick(hHex: any, vHex: any) {
    var index = document.getElementById(`500500_index`) as HTMLElement;

    if (this.store.get('mode') == 'remove') {
      this.tileService.placerJetonPlayer(this.playerActive, `${hHex}${vHex}`, true);
      this.store.set(StateKeys.MODE, 'normal');
    } else if (this.store.get('mode') == 'deplacer1') {
      var index = document.getElementById(`${hHex}${vHex}_index`) as HTMLElement;
      if (index.innerHTML.slice(0, 1) === 'p') {
        this.fillTileService.generate('500500', parseInt(index.innerHTML.slice(1)), batiments.pool);
      } else {
        this.fillTileService.generate('500500', parseInt(index.innerHTML.slice(1)), batiments.wonder);
      }
      this.fillTileService.generate(`${hHex}${vHex}`, 0, batiments.empty);
      var pl = document.getElementById(`${hHex}${vHex}_player`) as HTMLElement;
      const couleurFond: string = window.getComputedStyle(pl).backgroundColor;
      if (couleurFond === 'rgb(166, 3, 93)') {
        this.tileService.placerJetonPlayer(2, `500500`);
      } else {
        this.tileService.placerJetonPlayer(1, `500500`);
      }
      this.store.set(StateKeys.MODE, 'deplacer2');
    } else if (this.store.get('mode') == 'deplacer2') {
      if (index.innerHTML.slice(0, 1) == 'p') {
        this.fillTileService.generate(`${hHex}${vHex}`, parseInt(index.innerHTML.slice(1)), batiments.pool);
      } else {
        this.fillTileService.generate(`${hHex}${vHex}`, parseInt(index.innerHTML.slice(1)), batiments.wonder);
      }

      this.tileService.placerJetonPlayer(this.playerActive, `${hHex}${vHex}`);
      this.fillTileService.generate('500500', 0, batiments.empty);
      this.store.set(StateKeys.MODE, 'normal');
    } else {
      if (index.innerHTML.slice(0, 1) == 'p') {
        this.fillTileService.generate(`${hHex}${vHex}`, parseInt(index.innerHTML.slice(1)), batiments.pool);
      } else {
        this.fillTileService.generate(`${hHex}${vHex}`, parseInt(index.innerHTML.slice(1)), batiments.wonder);
      }
      this.tileService.placerJetonPlayer(this.playerActive, `${hHex}${vHex}`);
      this.fillTileService.generate('500500', 0, batiments.empty);
      this.endturn();
    }
  }

  startTurn() {}

  endturn() {
    this.changePlayer();
    this.store.set(StateKeys.MODE, 'normal');
  }

  changePlayer() {
    // Passer du joueur 1 au joueur 2
    if (this.player1.active) {
      this.player1.counterAdjTiles = this.counterAdjTiles;
      this.counterAdjTiles = this.player2.counterAdjTiles;
      this.player1.counterPoints = this.counterPoints;
      this.counterPoints = this.player2.counterPoints;
      this.playerActive = 2;
    } // Passer du joueur 2 au joueur 1
    else {
      this.player2.counterAdjTiles = this.counterAdjTiles;
      this.counterAdjTiles = this.player1.counterAdjTiles;
      this.player2.counterPoints = this.counterPoints;
      this.counterPoints = this.player1.counterPoints;
      this.playerActive = 1;
    }
    this.player1.active = !this.player1.active;
    this.player2.active = !this.player1.active;
  }

  /**
   * A bouger quand le store arrivera
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'p') {
      this.displayIndex = this.displayIndex + 1;
      this.fillTileService.generate('00', this.displayIndex, batiments.pool);
    }
  }
}
