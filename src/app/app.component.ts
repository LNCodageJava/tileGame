import { Component, HostListener, OnInit } from '@angular/core';
import { TileService } from './services/tile.service';
import parameters from './cfg/app.parameters.json';
import batiments from './cfg/batiment-colors.json';
import { BatimentDto } from './dto/batimentDto';
import { TuileDto } from './dto/tuileDto';
import { GlobalStore } from './store/global.store';
import { StateKeys } from './store/global.state';
const COUNTER_ADJ_START = 9;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private tileService: TileService, private store: GlobalStore) {}
  title = 'tileGame';

  gridSizeX = Array.from(Array(25).keys());
  gridSizeY = Array.from(Array(12).keys());

  counterAdjTiles = 0;
  counterPoints = 0;
  counterTotalTiles = 0;
  mode = 'normal';
  rotate = 0;

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
  i = 1;
  j = 0;

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
    // this.fillHandRandomTiles(1);
    // this.fillHandRandomTiles(2);
    this.startTurn();
    // ONLY FOR DEMO
    batiments.pool.forEach((batiment, index) => this.generate(this.calculateIdPrint(index), index, batiments.pool));
    batiments?.hand?.forEach((batiment, index) =>
      this.generate(this.calculateIdPrint(index + batiments.pool.length), index, batiments.hand)
    );
  }

  calculateIdPrint(index: number) {
    // this.j = this.j + 1;
    // let x = 4;
    // if (
    //   index === 0 ||
    //   index === x ||
    //   index === x * 2 - 1 ||
    //   index === x * 3 - 1 ||
    //   index === x * 4 - 2 ||
    //   index === x * 5 - 2 ||
    //   index === x * 6 - 3 ||
    //   index === x * 7 - 3 ||
    //   index === x * 8 - 3 ||
    //   index === x * 9 - 3 ||
    //   index === x * 10 - 3
    // ) {
    //   this.i = this.i + 1;
    //   if (this.i % 2 === 0) {
    //     this.j = 0;
    //   } else {
    //     this.j = 1;
    //   }
    // }
    // console.log(`${this.i}${this.j}`);
    // return `${this.i}${this.j}`;

    this.j = this.j + 1;
    let x = 3;
    if (index === 0 || index % x == 0) {
      this.i = this.i + 1;
      this.j = 0;
    }
    console.log(`${this.i}${this.j}`);
    return `${this.i}${this.j}`;
  }

  generate(idTuile: string, batimentIndex: number, batimentArray: any[]) {
    //console.log('generation de la tuile:' + this.TILE_NUMBER);

    this.setTuileData(
      idTuile,
      batimentArray[batimentIndex].name,
      batimentArray[batimentIndex].color,
      batimentArray[batimentIndex].points,
      batimentArray[batimentIndex].cost,
      batimentArray[batimentIndex].power
    );
  }

  resizeWindow() {
    let myWindow = document.getElementById('all');
    if (myWindow) {
      myWindow.style.height = `${document.documentElement.clientHeight}px`;
      myWindow.style.width = `${document.documentElement.clientWidth}px`;
    }
  }

  setTuileData(idTuile: string, batiment: string, color: string, points: string, cost: string, power: string) {
    console.log('AAAAAAAAAAAA', idTuile);
    var img = document.getElementById(`${idTuile}_batiment`) as HTMLImageElement;
    img.src = `assets/batiments/${batiment}.png`;

    var img = document.getElementById(`${idTuile}_couleur`) as HTMLImageElement;
    img.src = `assets/textures/${color}.png`;

    this.setCost(idTuile, cost);
    this.setPoints(idTuile, points, power);

    this.power = power;
  }

  setCost(idTuile: string, cost: string) {
    this.logos = [];
    let nbWaterLogo = cost.slice(0, 1);
    console.log(cost.length);
    var ele = document.getElementById(`${idTuile}_cost-container`) as HTMLElement;
    let innerHTML = '';
    for (let i = 0; i < cost.length; i++) {
      let eleSymbol = cost.slice(i, i + 1);
      let elementName;
      switch (eleSymbol) {
        case 'w':
          elementName = 'waterlogo';
          break;
        case 'g':
          elementName = 'leaflogo';
          break;
        case 's':
          elementName = 'sandlogo';
          break;
        case 'x':
          elementName = 'multicolorlogo';
          break;
      }
      innerHTML = innerHTML + `<img src="assets/textures/${elementName}.png" class="logo" />`;
    }
    ele.innerHTML = innerHTML;
  }

  setPoints(idTuile: string, points: string, power: string) {
    let pointLogo = points.slice(2, 3);
    let isBlack = points.slice(0, 1) == 'i';
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
    if (pointLogo === 'a' || pointLogo === 'e' || pointLogo === 'w' || pointLogo === 's' || pointLogo === 'g') {
      var img = document.getElementById(`${idTuile}_point-logo`) as HTMLImageElement;
      img.src = `assets/textures/${this.pointsLogo}.png`;

      this.points = points.slice(1, 2);
      var ele = document.getElementById(`${idTuile}_point`) as HTMLElement;
      ele.className = 'point';
      ele.innerHTML = this.points;
      ele.setAttribute('style', 'color: white!important;');

      var img = document.getElementById(`${idTuile}_corner`) as HTMLImageElement;
      isBlack ? (img.src = `assets/textures/corner-black.png`) : (img.src = `assets/textures/corner.png`);
    } else {
      var img = document.getElementById(`${idTuile}_corner`) as HTMLImageElement;
      isBlack ? (img.src = `assets/textures/corner-empty-black.png`) : (img.src = `assets/textures/corner-empty.png`);
      this.points = points.slice(1, 2);
      var ele = document.getElementById(`${idTuile}_point`) as HTMLElement;
      ele.className = 'point-empty';
      ele.innerHTML = this.points;
    }

    if (power != '') {
      var img = document.getElementById(`${idTuile}_corner`) as HTMLImageElement;
      isBlack ? (img.src = `assets/textures/corner-power-black.png`) : (img.src = `assets/textures/corner-power.png`);
      var img = document.getElementById(`${idTuile}_power`) as HTMLImageElement;
      img.src = `assets/textures/${power}.png`;
    }

    var ele = document.getElementById(`${idTuile}_point`) as HTMLElement;
    isBlack
      ? ele.setAttribute('style', 'color: white!important;')
      : ele.setAttribute('style', 'color: black!important;');

    var ele = document.getElementById(`${idTuile}_cost-container`) as HTMLElement;
    isBlack
      ? ele.setAttribute('style', 'background-color: black')
      : ele.setAttribute('style', 'background-color: white');
  }

  fillArray(idTuile: string, nb: string, elementName: string) {
    console.log(idTuile, nb);
    var ele = document.getElementById(`${idTuile}_cost-container`) as HTMLElement;
    for (let i = 0; i < parseInt(nb); i++) {
      console.log(ele);
      ele.innerHTML = `<img src="assets/textures/${elementName}.png" class="logo" />`;
    }
  }

  fillTuileDepart(): void {
    for (let i = 0; i < 6; i++) {
      if (i >= 4) this.tileService.coloreCote('510', i, 'w');
      else if (i >= 2) this.tileService.coloreCote('510', i, 's');
      else this.tileService.coloreCote('510', i, 'g');
    }
    this.tileService.findTuilesAdjacentes(5, 10);
    this.counterAdjTiles = this.tileService.createTuileBlancheAndReturnCost() + COUNTER_ADJ_START;
    this.tileService.placerBete('11', 'dragon');
    this.tileService.placerBete('13', 'golden');
    this.tileService.initMage();
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

  fillHandRandomTiles(player: number) {
    // let batimentsFiltre = batiments.batiments;
    // let batiment1 = this.takeRandomElementFromArray(batimentsFiltre);
    // this.tileService.setTuileData(`400${player}1`, batiment1.name, this.setBatimentColors(batiment1));
    // let batiment2 = this.takeRandomElementFromArray(batimentsFiltre);
    // this.tileService.setTuileData(`400${player}2`, batiment2.name, this.setBatimentColors(batiment2));
  }

  setBatimentColors(batiment: BatimentDto) {
    let currentColors = ['', '', '', '', '', ''];
    // On remplit d'abord la couleur requise
    if (batiment.color_required) {
      let color_required = batiment.color_required.split('');
      for (let i = 0; i < +color_required[0]; i++) {
        currentColors[i] = color_required[1];
      }
    }
    // On remplit les autres couleurs
    if (batiment.color) {
      // on extrait le nombre de couleurs et les couleurs possibles
      let colors = batiment.color.split('');
      let nbColor = colors.shift()!;
      // Pour 2 couleurs on fixe la 2eme couleur et on colore les cotés restants avec
      if (+nbColor === 2) {
        let color2 = this.takeRandomElementFromArray(colors);
        for (let i = 0; i < 6; i++) {
          if (currentColors[i] === '') {
            currentColors[i] = color2;
          }
        }
      }
      // Pour 3 couleurs on remplit chaque couleur aléatoirement
      else if (+nbColor === 3) {
        for (let i = 0; i < 6; i++) {
          if (currentColors[i] === '') {
            currentColors[i] = this.takeRandomElementFromArray(colors);
          }
        }
      }
    }
    return this.shuffle(currentColors);
  }

  /**
   * remplir le hex cliqué avec le hex courant
   * @param hHex
   * @param vHex
   */
  hexClick(hHex: any, vHex: any) {
    console.log(`click sur la tuile: ${hHex}${vHex}`);
    // this.counterTotalTiles++;
    // switch (this.mode) {
    //   case 'normal':
    //     this.hexClickNormalMode(hHex, vHex);
    //     break;
    //   case 'supprimer':
    //     this.hexClickSupprimerMode(hHex, vHex);
    //     break;
    //   case 'copier':
    //     this.hexClickCopierMode(this.previousTileId, hHex, vHex);
    //     break;
    //   case 'voler':
    //     this.hexClickVolerMode(hHex, vHex);
    //     break;
    //   case 'dragon':
    //   case 'golden':
    //     this.hexClickPlacerBete(hHex, vHex, this.mode);
    //     break;
    //   case 'move':
    //     this.tileService.getBete(`${hHex}${vHex}`);
    //     break;
    // }
    this.generate(`${hHex}${vHex}`, Math.floor(Math.random() * batiments.pool.length), batiments.pool);
  }

  startTurn() {
    // let tuile = this.tileService.getTuileData(`400${this.playerActive}1`);
    // this.tileService.setTuileData('500500', tuile.batimentName, tuile.colors);
    // this.currentTuile = this.tileService.getTuileData('500500');
    this.generate('4001', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.generate('4011', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.generate('4000', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.generate('4010', Math.floor(Math.random() * batiments.pool.length), batiments.pool);

    this.generate('4002', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.generate('4003', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.generate('4012', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
    this.generate('4013', Math.floor(Math.random() * batiments.pool.length), batiments.pool);
  }

  endturn() {
    this.fillHandRandomTiles(this.playerActive);
    this.changePlayer();
    this.store.set(StateKeys.MODE, 'normal');
    this.tuileActive = 1;
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

  hexClickSupprimerMode(hHex: any, vHex: any) {
    for (let i = 0; i < 6; i++) {
      this.tileService.coloreCote(`${hHex}${vHex}`, i, 'white');
    }
    this.tileService.placerBatiment(`${hHex}${vHex}`, 'no-image');
    this.tileService.placerJetonPlayer(`${hHex}${vHex}`, this.currentTuile, this.player1, this.player2);
    this.store.set(StateKeys.MODE, 'nextTurn');
  }

  hexClickCopierMode(previousTileId: string, hHex: any, vHex: any) {
    let adjBatiment = document.getElementById(`${hHex}${vHex}_img`) as HTMLImageElement;
    for (let i = 0; i < 6; i++) {
      if (adjBatiment) {
        let batimentName = adjBatiment.src.slice(39, adjBatiment.src.length - 4);
        this.tileService.placerBatiment(previousTileId, batimentName);
      }
    }
    this.store.set(StateKeys.MODE, 'nextTurn');
  }

  hexClickVolerMode(hHex: any, vHex: any) {
    this.tileService.placerJetonPlayer(`${hHex}${vHex}`, this.currentTuile, this.player1, this.player2);
    this.store.set(StateKeys.MODE, 'nextTurn');
  }

  hexClickPlacerBete(hHex: any, vHex: any, bete: string) {
    this.tileService.placerBete(`${hHex}${vHex}`, bete);
    this.tileService.placerBete('500500', 'no-image');
    this.store.set(StateKeys.MODE, 'nextTurn');
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
    //   if (event.key === 'n') {
    //     this.tileService.pivoterTuile('droite', this.currentTuile.colors);
    //     this.currentTuile = this.tileService.getTuileData('500500');
    //     this.rotate = this.rotate + 60;
    //     document.getElementById(`500500_img`)?.classList.remove('r60', 'r120', 'r0', 'r180', 'r240', 'r300', 'r360');
    //     document.getElementById(`500500_img`)?.classList.add(`r${this.rotate}`);
    //     if (this.rotate === 360) {
    //       this.rotate = 0;
    //     }
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
