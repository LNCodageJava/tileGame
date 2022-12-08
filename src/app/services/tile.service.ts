import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TileService {
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

  findTuilesAdjacentes(hHex: any, vHex: any, adjCounter: number) {
    // S, SE, NE, N, NO, SO
    let adjTuile = [];
    adjCounter = 0;

    // pair et impair
    adjTuile[0] = `${hHex}${vHex + 2}`;
    adjTuile[3] = `${hHex}${vHex - 2}`;
    // pair
    if (vHex % 2 === 0) {
      adjTuile[1] = `${hHex}${vHex + 1}`;
      adjTuile[2] = `${hHex}${vHex - 1}`;
      adjTuile[4] = `${hHex - 1}${vHex - 1}`;
      adjTuile[5] = `${hHex - 1}${vHex + 1}`;
    }
    // impair
    else {
      adjTuile[1] = `${hHex + 1}${vHex + 1}`;
      adjTuile[2] = `${hHex + 1}${vHex - 1}`;
      adjTuile[4] = `${hHex}${vHex - 1}`;
      adjTuile[5] = `${hHex}${vHex + 1}`;
    }

    //sert a trigger le coté adjacent
    // for (let i = 0; i < 6; i++) {
    //   if (i >= 0 && i < 3) {
    //     // nom du coté est + 1 par rapport a nom du tableau
    //     this.coloreCote(adjTuile[i], i + 4, 'water');
    //   } else {
    //     this.coloreCote(adjTuile[i], i - 2, 'water');
    //   }
    // }

    /// TODO ajouter conditionbord

    // colorier toutes les tuiles adj
    for (let i = 0; i < 6; i++) {
      let elem = document.getElementById(
        `${adjTuile[i]}_1`
      ) as HTMLImageElement;
      if (elem.src === 'http://localhost:4200/assets/batiments/no-image.png') {
        for (let j = 0; j < 6; j++) {
          this.coloreCote(adjTuile[i], j + 1, 'no-image');
        }
      } else if (
        elem.src !== 'http://localhost:4200/assets/textures/no-image.png'
      ) {
        adjCounter++;
      }
    }
    console.log(adjCounter);
    return adjCounter;
  }
}
