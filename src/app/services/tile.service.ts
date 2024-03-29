import { Injectable } from '@angular/core';
import { TuileDto } from '../dto/tuileDto';
import { StateKeys } from '../store/global.state';
import { GlobalStore } from '../store/global.store';

@Injectable({
  providedIn: 'root',
})
export class TileService {
  // S, SE, NE, N, NO, SO
  adjTuiles: string[] = [];
  adjTuiles2: string[] = [];
  mageAngle: number = 0;
  constructor(private store: GlobalStore) {}

  coloreCote(idTuile: string, cote: number, couleur: string): void {
    var tuileCote = document.getElementById(`${idTuile}_${cote}`) as HTMLImageElement;
    if (tuileCote) {
      tuileCote.src = `assets/textures/${couleur}.png`;
    }
  }

  placerBatiment(idTuile: string, batimentName: string) {
    var img = document.getElementById(`${idTuile}_img`) as HTMLImageElement;
    if (img) {
      img.src = `assets/batiments/${batimentName}.png`;
    }
  }

  pivoterTuile(direction: string, currentColors: string[]) {
    if (direction === 'gauche') {
      currentColors.unshift(currentColors.pop()!);
      for (let i = 0; i <= 6; i++) {
        this.coloreCote('500500', i, currentColors[i]);
      }
    } else if (direction === 'droite') {
      currentColors.push(currentColors.shift()!);
      for (let i = 0; i <= 6; i++) {
        this.coloreCote('500500', i, currentColors[i]);
      }
    }
  }

  findTuilesAdjacentes(hHex: any, vHex: any) {
    // pair et impair
    this.adjTuiles[0] = `${hHex}${vHex + 2}`;
    this.adjTuiles[3] = `${hHex}${vHex - 2}`;
    // pair
    if (vHex % 2 === 0) {
      this.adjTuiles[1] = `${hHex}${vHex + 1}`;
      this.adjTuiles[2] = `${hHex}${vHex - 1}`;
      this.adjTuiles[4] = `${hHex - 1}${vHex - 1}`;
      this.adjTuiles[5] = `${hHex - 1}${vHex + 1}`;
    }
    // impair
    else {
      this.adjTuiles[1] = `${hHex + 1}${vHex + 1}`;
      this.adjTuiles[2] = `${hHex + 1}${vHex - 1}`;
      this.adjTuiles[4] = `${hHex}${vHex - 1}`;
      this.adjTuiles[5] = `${hHex}${vHex + 1}`;
    }
  }

  findTuilesAdjacentes2(hHex: any, vHex: any) {
    // pair et impair
    this.adjTuiles2[0] = `${hHex}${vHex + 4}`;
    this.adjTuiles2[3] = `${hHex}${vHex - 4}`;
    // pair
    if (vHex % 2 === 0) {
      this.adjTuiles2[1] = `${hHex + 1}${vHex + 2}`;
      this.adjTuiles2[2] = `${hHex + 1}${vHex - 2}`;
      this.adjTuiles2[4] = `${hHex - 1}${vHex - 2}`;
      this.adjTuiles2[5] = `${hHex - 1}${vHex + 2}`;
    }
    // impair
    else {
      this.adjTuiles2[1] = `${hHex + 1}${vHex + 2}`;
      this.adjTuiles2[2] = `${hHex + 1}${vHex - 2}`;
      this.adjTuiles2[4] = `${hHex - 1}${vHex - 2}`;
      this.adjTuiles2[5] = `${hHex - 1}${vHex + 2}`;
    }
  }

  countPoints(hHex: any, vHex: any): number {
    let turnPoints = 0;
    // let batiment = document.getElementById(`${hHex}${vHex}_img`) as HTMLImageElement;
    // let batimentName = batiment.src.slice(39, batiment.src.length - 4);
    // switch (batimentName) {
    //   case 'bateau':
    //     turnPoints = this.countAdjCoteColor('w', turnPoints);
    //     break;
    //   case 'moulin':
    //     turnPoints = this.countAdjCoteColor('g', turnPoints);
    //     break;
    //   case 'colonne':
    //     turnPoints = this.countAdjCoteColor('s', turnPoints);
    //     break;
    //   case 'phare':
    //     this.findTuilesAdjacentes2(hHex, vHex);
    //     turnPoints = this.countAdj2CoteBatiment('bateau', turnPoints);
    //     break;
    //   case 'temple':
    //     this.findTuilesAdjacentes2(hHex, vHex);
    //     turnPoints = this.countAdj2CoteBatiment('colonne', turnPoints);
    //     break;
    //   case 'marche':
    //     this.findTuilesAdjacentes2(hHex, vHex);
    //     turnPoints = this.countAdj2CoteBatiment('moulin', turnPoints);
    //     break;
    //   case 'colisee':
    //     this.findTuilesAdjacentes2(hHex, vHex);
    //     turnPoints = this.countAdj2CoteBatiment('tout', turnPoints);
    //     break;
    //   default:
    //     break;
    // }

    return turnPoints;
  }

  /**
   * Compte le nombre de cotés adjacents de même couleur que celle en input
   * @param color
   * @param turnPoints
   * @returns
   */
  countAdjCoteColor(color: string, turnPoints: number): number {
    for (let i = 0; i < 6; i++) {
      let indexCote;
      if (i >= 0 && i < 3) {
        indexCote = i + 3;
      } else {
        indexCote = i - 3;
      }
      let adj = document.getElementById(`${this.adjTuiles[i]}_${indexCote}`) as HTMLImageElement;
      if (adj) {
        let colorCote = adj.src.slice(38, adj.src.length - 4);
        if (colorCote === color) {
          turnPoints++;
        }
      }
    }
    return turnPoints;
  }

  /**
   * Compte le nombre de batiment adjacents2 comme celui en input
   * @param color
   * @param turnPoints
   * @returns
   */
  countAdj2CoteBatiment(batiment: string, turnPoints: number): number {
    for (let i = 0; i < 6; i++) {
      // Trouver les noms des batiments adjacent2
      let adjBatiment = document.getElementById(`${this.adjTuiles[i]}_img`) as HTMLImageElement;
      let adj2Batiment = document.getElementById(`${this.adjTuiles2[i]}_img`) as HTMLImageElement;

      if (adjBatiment) {
        let adjBatimentName = adjBatiment.src.slice(39, adjBatiment.src.length - 4);
        // Cas du colisée
        if (
          batiment === 'tout' &&
          (adjBatimentName === 'bateau' || adjBatimentName === 'moulin' || adjBatimentName === 'colonne')
        ) {
          turnPoints = turnPoints + 2;
        }
        // Autre cas
        if (adjBatimentName === batiment) {
          turnPoints = turnPoints + 2;
        }
      }

      if (adj2Batiment) {
        let adj2BatimentName = adj2Batiment.src.slice(39, adj2Batiment.src.length - 4);
        if (
          // Cas du colisée
          batiment === 'tout' &&
          (adj2BatimentName === 'bateau' || adj2BatimentName === 'moulin' || adj2BatimentName === 'colonne')
        ) {
          turnPoints = turnPoints + 2;
        }
        // Autre cas
        if (adj2BatimentName === batiment) {
          turnPoints = turnPoints + 2;
        }
      }
    }
    return turnPoints;
  }

  createTuileBlancheAndReturnCost(): number {
    let counterAdjTiles = 0;
    for (let i = 0; i < 6; i++) {
      let elem = document.getElementById(`${this.adjTuiles[i]}_1`) as HTMLImageElement;
      if (elem && elem.src === 'http://localhost:4200/assets/textures/no-image.png') {
        for (let j = 0; j < 6; j++) {
          this.coloreCote(this.adjTuiles[i], j, 'white');
        }
      } else if (elem && elem.src !== 'http://localhost:4200/assets/textures/white.png') {
        counterAdjTiles++;
      }
    }
    return counterAdjTiles;
  }

  changeMode(batimentName: string): string {
    switch (batimentName) {
      case 'kraken':
      case 'scorpion':
        this.setCurrentTileMode('no-image', 'select');
        return 'supprimer';
      case 'voler':
        this.setCurrentTileMode('no-image', 'select');
        return 'voler';
      case 'copier':
        this.setCurrentTileMode('no-image', 'select');
        return 'copier';
      case 'colonnesacre':
      case 'bateausacre':
      case 'moulinsacre':
        this.setCurrentTileMode('no-image', 'arrow');
        return 'move';
      default:
        return 'nextTurn';
    }
  }

  getBete(idTuile: string) {
    let beteTargetTuile = document.getElementById(`${idTuile}_bete`) as HTMLImageElement;
    let beteName = beteTargetTuile.src.slice(35, beteTargetTuile.src.length - 4);
    this.placerBete(idTuile, 'no-image');
    if (beteName !== 'no-image') {
      this.changeModeToBete(beteName);
    }
    if (document.getElementById(`${idTuile}`)!.id === '510') {
      this.store.set(StateKeys.MODE, 'nextTurn');
    }
  }

  setCurrentTileMode(batiment: string, cotes: string) {
    this.placerBatiment(`500500`, batiment);
    for (let j = 0; j < 6; j++) {
      this.coloreCote(`500500`, j, cotes);
    }
  }

  changeModeToBete(bete: string) {
    this.setTuileData('500500', 'no-image', ['no-image', 'no-image', 'no-image', 'no-image', 'no-image', 'no-image']);
    this.placerBete('500500', bete);
    this.store.set(StateKeys.MODE, bete);
  }

  placerJetonPlayer(idTuile: string, tuile: TuileDto, player1: any, player2: any) {
    var div = document.getElementById(`${idTuile}_player`);
    if (
      div &&
      (tuile.batimentName === 'phare' ||
        tuile.batimentName === 'marche' ||
        tuile.batimentName === 'temple' ||
        tuile.batimentName === 'pharesacre' ||
        tuile.batimentName === 'marchesacre' ||
        tuile.batimentName === 'templesacre' ||
        tuile.batimentName === 'zoo' ||
        tuile.batimentName === 'colisee' ||
        tuile.batimentName === 'grandtemple' ||
        tuile.batimentName === 'copier' ||
        this.store.get(StateKeys.MODE) === 'voler')
    ) {
      if (player1.active) {
        console.log('p1');
        div.style.backgroundColor = player1.color;
      } else {
        console.log('p2');
        div.style.backgroundColor = player2.color;
      }
    } else if (div) {
      console.log('rien');
      div.style.backgroundColor = 'transparent';
    }
  }

  placerBete(idTuile: string, bete: string) {
    var img = document.getElementById(`${idTuile}_bete`) as HTMLImageElement;
    if (img) {
      img.src = `assets/betes/${bete}.png`;
    }
  }

  changeTuileActive(playerActive: any, tuileActive: any) {
    if (tuileActive === 1) {
      tuileActive = 2;
    } else {
      tuileActive = 1;
    }
    let tuile = this.getTuileData(`400${playerActive}${tuileActive}`);
    this.setTuileData('500500', tuile.batimentName, tuile.colors);
    return tuileActive;
  }

  getTuileData(idTuile: string): TuileDto {
    let tuile: TuileDto = {
      batimentName: '',
      colors: [],
    };
    let batimentTargetTuile = document.getElementById(`${idTuile}_img`) as HTMLImageElement;
    tuile.batimentName = batimentTargetTuile.src.slice(39, batimentTargetTuile.src.length - 4);
    for (let i = 0; i < 6; i++) {
      let colors = document.getElementById(`${idTuile}_${i}`) as HTMLImageElement;
      tuile.colors[i] = colors.src.slice(38, colors.src.length - 4);
    }
    return tuile;
  }

  setTuileData(idTuile: string, batiment: string, colors: string[]) {
    this.placerBatiment(idTuile, batiment);
    for (let i = 0; i < 6; i++) {
      this.coloreCote(idTuile, i, colors[i]);
    }
  }

  turnMage() {
    let image = document.getElementById('mage');
    image!.style.rotate = `${this.mageAngle + 120}deg`;
    this.mageAngle = this.mageAngle + 120;
  }

  initMage() {
    var startTile = document.getElementById('510');
    var image = document.createElement('img');
    image.src = 'assets/betes/mage.png';
    image.className = 'mage';
    image.id = 'mage';
    startTile?.appendChild(image);
  }
}
