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
    // this.fillTuileDepart();
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
    //this.fillTileService.generate('01',)
    var img = document.getElementById(`66_couleur`) as HTMLImageElement;
    img.src = `assets/textures/w.png`;

    var img = document.getElementById(`67_couleur`) as HTMLImageElement;
    img.src = `assets/textures/s.png`;

    var img = document.getElementById(`77_couleur`) as HTMLImageElement;
    img.src = `assets/textures/g.png`;

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
    this.fillTileService.generate('4003', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4012', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.fillTileService.generate('4013', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
  }

  // setBatimentColors(batiment: BatimentDto) {
  //   let currentColors = ['', '', '', '', '', ''];
  //   // On remplit d'abord la couleur requise
  //   if (batiment.color_required) {
  //     let color_required = batiment.color_required.split('');
  //     for (let i = 0; i < +color_required[0]; i++) {
  //       currentColors[i] = color_required[1];
  //     }
  //   }
  //   // On remplit les autres couleurs
  //   if (batiment.color) {
  //     // on extrait le nombre de couleurs et les couleurs possibles
  //     let colors = batiment.color.split('');
  //     let nbColor = colors.shift()!;
  //     // Pour 2 couleurs on fixe la 2eme couleur et on colore les cotés restants avec
  //     if (+nbColor === 2) {
  //       let color2 = this.takeRandomElementFromArray(colors);
  //       for (let i = 0; i < 6; i++) {
  //         if (currentColors[i] === '') {
  //           currentColors[i] = color2;
  //         }
  //       }
  //     }
  //     // Pour 3 couleurs on remplit chaque couleur aléatoirement
  //     else if (+nbColor === 3) {
  //       for (let i = 0; i < 6; i++) {
  //         if (currentColors[i] === '') {
  //           currentColors[i] = this.takeRandomElementFromArray(colors);
  //         }
  //       }
  //     }
  //   }
  //   return this.shuffle(currentColors);
  // }

  /**
   * remplir le hex cliqué avec le hex courant
   * @param hHex
   * @param vHex
   */
  hexClick(hHex: any, vHex: any) {
    var index = document.getElementById(`500500_index`) as HTMLElement;
    if (index.innerHTML === '0') {
      this.tileService.removejetonPlayer(`${hHex}${vHex}`);
    } else {
      this.fillTileService.generate(`${hHex}${vHex}`, parseInt(index.innerHTML), batiments.pool);
      this.tileService.placerJetonPlayer(this.playerActive, `${hHex}${vHex}`);
      this.endturn();
    }
  }

  startTurn() {}

  endturn() {
    // this.fillHandRandomTiles(this.playerActive);
    this.changePlayer();
    this.store.set(StateKeys.MODE, 'normal');
    this.fillTileService.generate('500500', 0, batiments.pool);
  }

  hexClickNormalMode(hHex: any, vHex: any) {
    // let tuileRef = this.tileService.getTuileData('500500');
    // this.tileService.setTuileData(`${hHex}${vHex}`, tuileRef.batimentName, tuileRef.colors);
    // document.getElementById(`${hHex}${vHex}_img`)?.classList.add(`r${this.rotate}`);
    // this.tileService.placerJetonPlayer(`${hHex}${vHex}`, this.currentTuile, this.player1, this.player2);
    // this.tileService.findTuilesAdjacentes(hHex, vHex);
    // this.counterAdjTiles = this.tileService.createTuileBlancheAndReturnCost();
    // this.counterPoints = this.counterPoints + this.tileService.countPoints(hHex, vHex);
    // this.previousTileId = `${hHex}${vHex}`;
    // this.store.set(StateKeys.MODE, this.tileService.changeMode(this.currentTuile.batimentName));
  }

  // hexClickSupprimerMode(hHex: any, vHex: any) {
  //   for (let i = 0; i < 6; i++) {
  //     this.tileService.coloreCote(`${hHex}${vHex}`, i, 'white');
  //   }
  //   this.tileService.placerBatiment(`${hHex}${vHex}`, 'no-image');
  //   this.tileService.placerJetonPlayer(`${hHex}${vHex}`, this.currentTuile, this.player1, this.player2);
  //   this.store.set(StateKeys.MODE, 'nextTurn');
  // }

  // hexClickCopierMode(previousTileId: string, hHex: any, vHex: any) {
  //   let adjBatiment = document.getElementById(`${hHex}${vHex}_img`) as HTMLImageElement;
  //   for (let i = 0; i < 6; i++) {
  //     if (adjBatiment) {
  //       let batimentName = adjBatiment.src.slice(39, adjBatiment.src.length - 4);
  //       this.tileService.placerBatiment(previousTileId, batimentName);
  //     }
  //   }
  //   this.store.set(StateKeys.MODE, 'nextTurn');
  // }

  // hexClickVolerMode(hHex: any, vHex: any) {
  //   this.tileService.placerJetonPlayer(`${hHex}${vHex}`, this.currentTuile, this.player1, this.player2);
  //   this.store.set(StateKeys.MODE, 'nextTurn');
  // }

  // hexClickPlacerBete(hHex: any, vHex: any, bete: string) {
  //   this.tileService.placerBete(`${hHex}${vHex}`, bete);
  //   this.tileService.placerBete('500500', 'no-image');
  //   this.store.set(StateKeys.MODE, 'nextTurn');
  // }

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
    //     console.log(this.rotate);
    //   } else if (event.key === 'b') {
    //     this.tileService.pivoterTuile('gauche', this.currentTuile.colors);
    //     this.currentTuile = this.tileService.getTuileData('500500');
    //     if (this.rotate === 0) {
    //       this.rotate = 360;
    //     }
    //     this.rotate = this.rotate - 60;
    //     document.getElementById(`500500_img`)?.classList.remove('r60', 'r120', 'r0', 'r180', 'r240', 'r300', 'r360');
    //     document.getElementById(`500500_img`)?.classList.add(`r${this.rotate}`);
    //   } else if (event.key === 'v' && this.mode === 'normal') {
    //     this.tuileActive = this.tileService.changeTuileActive(this.playerActive, this.tuileActive);
    //     this.currentTuile = this.tileService.getTuileData('500500');
    //   } else if (event.key === 'd') {
    //     this.tileService.changeModeToBete('dragon');
    //   } else if (event.key === 'g') {
    //     this.tileService.changeModeToBete('golden');
    //   } else if (event.key === 'm') {
    //     this.tileService.turnMage();
    //   }
    // }
  }
}
