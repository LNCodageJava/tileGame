import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TileService {
  // S, SE, NE, N, NO, SO
  adjTuiles: string[] = [];
  adjTuiles2: string[] = [];
  constructor() {}
  //adjCounter = 0;
  coloreCote(idTuile: string, cote: number, couleur: string): void {
    // console.log('jecolorie', idTuile);
    var tuileCote = document.getElementById(
      `${idTuile}_${cote}`
    ) as HTMLImageElement;
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
      //console.log(currentColors);
      // ! not null assertion
      currentColors.unshift(currentColors.pop()!);
      for (let i = 0; i <= 6; i++) {
        this.coloreCote('500500', i + 1, currentColors[i]);
      }
    } else if (direction === 'droite') {
      //console.log(currentColors);
      // ! not null assertion
      currentColors.push(currentColors.shift()!);
      for (let i = 0; i <= 6; i++) {
        this.coloreCote('500500', i + 1, currentColors[i]);
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
    let batiment = document.getElementById(
      `${hHex}${vHex}_img`
    ) as HTMLImageElement;
    // console.log('batiment', batiment.src.slice(39, batiment.src.length - 4));
    let batimentName = batiment.src.slice(39, batiment.src.length - 4);
    switch (batimentName) {
      case 'bateau':
        turnPoints = this.countAdjCoteColor('w', turnPoints);
        break;
      case 'moulin':
        turnPoints = this.countAdjCoteColor('g', turnPoints);
        break;
      case 'colonne':
        turnPoints = this.countAdjCoteColor('s', turnPoints);
        break;
      case 'phare':
        this.findTuilesAdjacentes2(hHex, vHex);
        turnPoints = this.countAdj2CoteBatiment('bateau', turnPoints);
        break;
      case 'temple':
        this.findTuilesAdjacentes2(hHex, vHex);
        turnPoints = this.countAdj2CoteBatiment('colonne', turnPoints);
        break;
      case 'marche':
        this.findTuilesAdjacentes2(hHex, vHex);
        turnPoints = this.countAdj2CoteBatiment('moulin', turnPoints);
        break;
      case 'colisee':
        this.findTuilesAdjacentes2(hHex, vHex);
        turnPoints = this.countAdj2CoteBatiment('tout', turnPoints);
        break;
      default:
        break;
    }

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
        indexCote = i + 4;
      } else {
        indexCote = i - 2;
      }
      let adj = document.getElementById(
        `${this.adjTuiles[i]}_${indexCote}`
      ) as HTMLImageElement;
      let colorCote = adj.src.slice(38, adj.src.length - 4);
      if (colorCote === color) {
        turnPoints++;
      }
      console.log(colorCote);
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
      let adjBatiment = document.getElementById(
        `${this.adjTuiles[i]}_img`
      ) as HTMLImageElement;
      let adj2Batiment = document.getElementById(
        `${this.adjTuiles2[i]}_img`
      ) as HTMLImageElement;

      let adjBatimentName = adjBatiment.src.slice(
        39,
        adjBatiment.src.length - 4
      );
      let adj2BatimentName = adj2Batiment.src.slice(
        39,
        adj2Batiment.src.length - 4
      );

      // Cas du colisée
      if (
        batiment === 'tout' &&
        (adjBatimentName === 'bateau' ||
          adjBatimentName === 'moulin' ||
          adjBatimentName === 'colonne')
      ) {
        turnPoints = turnPoints + 2;
      }

      if (
        batiment === 'tout' &&
        (adj2BatimentName === 'bateau' ||
          adj2BatimentName === 'moulin' ||
          adj2BatimentName === 'colonne')
      ) {
        turnPoints = turnPoints + 2;
      }

      // Autre cas
      if (adjBatimentName === batiment) {
        turnPoints = turnPoints + 2;
      }
      if (adj2BatimentName === batiment) {
        turnPoints = turnPoints + 2;
      }
    }
    return turnPoints;
  }

  /// TODO ajouter conditionbord

  createTuileBlancheAndReturnCost(): number {
    // colorier toutes les tuiles adj
    let adjCounter = 0;
    for (let i = 0; i < 6; i++) {
      let elem = document.getElementById(
        `${this.adjTuiles[i]}_1`
      ) as HTMLImageElement;
      if (elem.src === 'http://localhost:4200/assets/batiments/no-image.png') {
        for (let j = 0; j < 6; j++) {
          this.coloreCote(this.adjTuiles[i], j + 1, 'no-image');
        }
      } else if (
        elem.src !== 'http://localhost:4200/assets/textures/no-image.png'
      ) {
        adjCounter++;
      }
    }
    return adjCounter;
  }
}
