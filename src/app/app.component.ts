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

  gridSizeX = Array.from(Array(10).keys());
  gridSizeY = Array.from(Array(20).keys());

  // S, SE, NE, N, NO, SO
  currentColors: string[] = ['', '', '', '', '', ''];
  counterAdjTiles = 0;
  counterPoints = 0;
  counterTotalTiles = 0;
  mode = 'normal';

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

  ngOnInit(): void {
    console.log(this.store.get(StateKeys.DICE_RESULT));
  }

  ngAfterViewInit(): void {
    this.fillTuileDepart();
    this.fillHandRandomTiles(1);
    this.fillHandRandomTiles(2);
    this.startTurn();
    this.resizeWindow();
  }

  resizeWindow() {
    console.log(document.documentElement.clientHeight);
    let myWindow = document.getElementById('all');
    if (myWindow) {
      myWindow.style.height = `${document.documentElement.clientHeight}px`;
      myWindow.style.width = `${document.documentElement.clientWidth}px`;
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
    let batimentsFiltre = batiments.batiments.filter((b) => b.cout === this.counterAdjTiles);

    let batiment1 = this.takeRandomElementFromArray(batimentsFiltre);
    this.tileService.setTuileData(`400${player}1`, batiment1.name, this.setBatimentColors(batiment1));

    let batiment2 = this.takeRandomElementFromArray(batimentsFiltre);
    this.tileService.setTuileData(`400${player}2`, batiment2.name, this.setBatimentColors(batiment2));
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
          if (this.currentColors[i] === '') {
            this.currentColors[i] = this.takeRandomElementFromArray(colors);
          }
        }
      }
    }
    return this.shuffle(this.currentColors);
  }

  /**
   * remplir le hex cliqué avec le hex courant
   * @param hHex
   * @param vHex
   */
  hexClick(hHex: any, vHex: any) {
    console.log(`click sur la tuile ${hHex}${vHex}`);
    this.currentTuile = this.tileService.getTuileData('500500');
    this.counterTotalTiles++;
    switch (this.mode) {
      case 'normal':
        this.hexClickNormalMode(hHex, vHex);
        break;
      case 'supprimer':
        this.hexClickSupprimerMode(hHex, vHex);
        break;
      case 'copier':
        this.hexClickCopierMode(this.previousTileId, hHex, vHex);
        break;
      case 'voler':
        this.hexClickVolerMode(hHex, vHex);
        break;
      case 'dragon':
        this.hexClickPlacerBete(hHex, vHex, 'dragon');
        return;
    }

    // on change de mode que au placement d'une tuile donc en mode normal
    if (this.mode === 'normal') {
      this.previousTileId = `${hHex}${vHex}`;
      this.mode = this.tileService.changeMode(this.currentTuile.batimentName);
    }

    // si le mode a changé on finit pas le tour
    if (this.mode !== 'normal' && this.mode !== 'nextTurn') {
      return;
    }
    this.endturn();
    this.startTurn();
  }

  startTurn() {
    let tuile = this.tileService.getTuileData(`400${this.playerActive}1`);
    this.tileService.setTuileData('500500', tuile.batimentName, tuile.colors);
  }

  endturn() {
    this.fillHandRandomTiles(this.playerActive);
    this.changePlayer();
    this.mode = 'normal';
    this.tuileActive = 1;
  }

  hexClickNormalMode(hHex: any, vHex: any) {
    let tuileRef = this.tileService.getTuileData('500500');
    this.tileService.setTuileData(`${hHex}${vHex}`, tuileRef.batimentName, tuileRef.colors);
    this.tileService.placerJetonPlayer(`${hHex}${vHex}`, this.currentTuile, this.player1, this.player2);
    this.tileService.findTuilesAdjacentes(hHex, vHex);
    this.counterAdjTiles = this.tileService.createTuileBlancheAndReturnCost();
    this.counterPoints = this.counterPoints + this.tileService.countPoints(hHex, vHex);
  }

  hexClickSupprimerMode(hHex: any, vHex: any) {
    for (let i = 0; i < 6; i++) {
      this.tileService.coloreCote(`${hHex}${vHex}`, i, 'white');
    }
    this.tileService.placerBatiment(`${hHex}${vHex}`, 'no-image');
    this.tileService.placerJetonPlayer(`${hHex}${vHex}`, this.currentTuile, this.player1, this.player2);
    this.mode = 'nextTurn';
  }

  hexClickCopierMode(previousTileId: string, hHex: any, vHex: any) {
    console.log('copie');
    let adjBatiment = document.getElementById(`${hHex}${vHex}_img`) as HTMLImageElement;
    for (let i = 0; i < 6; i++) {
      if (adjBatiment) {
        let batimentName = adjBatiment.src.slice(39, adjBatiment.src.length - 4);
        this.tileService.placerBatiment(previousTileId, batimentName);
      }
    }
    this.mode = 'nextTurn';
  }

  hexClickVolerMode(hHex: any, vHex: any) {
    console.log('voler');
    this.tileService.placerJetonPlayer(`${hHex}${vHex}`, this.currentTuile, this.player1, this.player2);
    this.mode = 'nextTurn';
  }

  hexClickPlacerBete(hHex: any, vHex: any, bete: string) {
    this.tileService.placerBete(hHex, vHex, 'dragon');
    this.tileService.placerBete(500, 500, 'no-image');
    this.mode = 'normal';
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
    if (event.key === 'n') {
      this.tileService.pivoterTuile('droite', this.currentColors);
    } else if (event.key === 'b') {
      this.tileService.pivoterTuile('gauche', this.currentColors);
    } else if (event.key === 'v' && this.mode === 'normal') {
      this.tuileActive = this.tileService.changeTuileActive(this.playerActive, this.tuileActive);
    } else if (event.key === 'd') {
      this.tileService.changeCurrentTileToBete('dragon');
      this.mode = 'dragon';
    }
  }
}
