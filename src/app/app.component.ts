import { Component, HostListener, OnInit } from '@angular/core';
import { TileService } from './services/tile.service';
import parameters from './cfg/app.parameters.json';
import batiments from './cfg/batiment-colors.json';
import { BatimentDto } from './dto/batimentDto';
const COUNTER_ADJ_START = 1000;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private tileService: TileService) {}
  title = 'tileGame';

  gridSizeX = Array.from(Array(10).keys());
  gridSizeY = Array.from(Array(20).keys());
  currentBatiment: BatimentDto = {
    name: 'no-image',
    cout: 0,
  };
  // S, SE, NE, N, NO, SO
  currentColors: string[] = ['', '', '', '', '', ''];
  counterAdjTiles = 0;
  counterPoints = 0;
  counterTotalTiles = 0;
  mode = 'normal';

  player1 = {
    nom: 'Scratch',
    active: true,
    counterAdjTiles: COUNTER_ADJ_START,
    counterPoints: 0,
    color: '#2C63BF',
  };

  player2 = {
    nom: 'LNC',
    active: false,
    counterAdjTiles: COUNTER_ADJ_START,
    counterPoints: 0,
    color: '#BF352C',
  };
  previousTileId = '';

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.fillTuileDepart();
    this.fillTuileCurrent();
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

  /**
   * Remplit
   */
  setCurrentColors() {
    this.currentColors = ['', '', '', '', '', ''];
    // On remplit d'abord la couleur requise
    if (this.currentBatiment.color_required) {
      let color_required = this.currentBatiment.color_required.split('');
      for (let i = 0; i < +color_required[0]; i++) {
        this.currentColors[i] = color_required[1];
      }
    }
    // On remplit les autres couleurs
    if (this.currentBatiment.color) {
      // on extrait le nombre de couleurs et les couleurs possibles
      let colors = this.currentBatiment.color.split('');
      let nbColor = colors.shift()!;

      // Pour 2 couleurs on fixe la 2eme couleur et on colore les cotés restants avec
      if (+nbColor === 2) {
        let color2 = this.takeRandomElementFromArray(colors);
        console.log('couleur2', color2);
        for (let i = 0; i < 6; i++) {
          if (this.currentColors[i] === '') {
            this.currentColors[i] = color2;
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
    this.currentColors = this.shuffle(this.currentColors);
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

  fillTuileCurrent() {
    // remplir bâtiments
    let batimentsFiltre = batiments.batiments.filter((b) => b.cout === this.counterAdjTiles);
    this.currentBatiment = batimentsFiltre[Math.floor(Math.random() * batimentsFiltre.length)];
    this.tileService.placerBatiment(`500500`, this.currentBatiment.name);

    // remplir couleurs
    this.setCurrentColors();
    for (let i = 0; i < 6; i++) {
      this.tileService.coloreCote('500500', i, this.currentColors[i]);
    }
  }

  /**
   * remplir le hex cliqué avec le hex courant
   * @param hHex
   * @param vHex
   */
  hexClick(hHex: any, vHex: any) {
    console.log(`click sur la tuile ${hHex}${vHex}`);
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
    }

    // on change de mode que au placement d'une tuile donc en mode normal
    if (this.mode === 'normal') {
      this.previousTileId = `${hHex}${vHex}`;
      this.mode = this.tileService.changeMode(this.currentBatiment.name);
    }

    // si le mode a changé on passe pas le tour
    console.log('modeAfter', this.mode);
    if (this.mode !== 'normal' && this.mode !== 'nextTurn') {
      return;
    }
    // Reinitialiser la tuile courante et le batiment et le joueur
    this.changePlayer();
    this.fillTuileCurrent();
    this.mode = 'normal';
  }

  hexClickNormalMode(hHex: any, vHex: any) {
    for (let i = 0; i < 6; i++) {
      this.tileService.coloreCote(`${hHex}${vHex}`, i, this.currentColors[i]);
    }
    this.tileService.placerBatiment(`${hHex}${vHex}`, this.currentBatiment.name);
    this.tileService.placerPlayer(`${hHex}${vHex}`, this.currentBatiment.cout, this.player1, this.player2);

    this.tileService.findTuilesAdjacentes(hHex, vHex);
    this.counterAdjTiles = this.tileService.createTuileBlancheAndReturnCost();
    this.counterPoints = this.counterPoints + this.tileService.countPoints(hHex, vHex);
  }

  hexClickSupprimerMode(hHex: any, vHex: any) {
    for (let i = 0; i < 6; i++) {
      this.tileService.coloreCote(`${hHex}${vHex}`, i, 'no-image');
    }
    this.tileService.placerBatiment(`${hHex}${vHex}`, 'no-image');
    this.tileService.placerPlayer(`${hHex}${vHex}`, 0, this.player1, this.player2);
    this.mode = 'nextTurn';
  }

  hexClickCopierMode(previousTileId: string, hHex: any, vHex: any) {
    console.log('copie');
    // let copiedColors = [];
    let adjBatiment = document.getElementById(`${hHex}${vHex}_img`) as HTMLImageElement;
    for (let i = 0; i < 6; i++) {
      // let elem = document.getElementById(`${hHex}${vHex}_${i}`) as HTMLImageElement;
      // copiedColors[i] = elem.src.slice(38, elem.src.length - 4);
      // this.tileService.coloreCote(previousTileId, i, copiedColors[i]);
      if (adjBatiment) {
        let batimentName = adjBatiment.src.slice(39, adjBatiment.src.length - 4);
        this.tileService.placerBatiment(previousTileId, batimentName);
      }
    }
    this.mode = 'nextTurn';
  }

  hexClickVolerMode(hHex: any, vHex: any) {
    console.log('voler');
    this.tileService.placerPlayer(`${hHex}${vHex}`, 99, this.player1, this.player2);
    this.mode = 'nextTurn';
  }

  changePlayer() {
    // Passer du joueur 1 au joueur 2
    if (this.player1.active) {
      this.player1.counterAdjTiles = this.counterAdjTiles;
      this.counterAdjTiles = this.player2.counterAdjTiles;
      this.player1.counterPoints = this.counterPoints;
      this.counterPoints = this.player2.counterPoints;
    } // Passer du joueur 2 au joueur 1
    else {
      this.player2.counterAdjTiles = this.counterAdjTiles;
      this.counterAdjTiles = this.player1.counterAdjTiles;
      this.player2.counterPoints = this.counterPoints;
      this.counterPoints = this.player1.counterPoints;
    }
    this.player1.active = !this.player1.active;
    this.player2.active = !this.player1.active;

    console.log(this.player1);
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
    }
  }
}
