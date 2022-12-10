import { Component, HostListener, OnInit } from '@angular/core';
import { TileService } from './services/tile.service';
import parameters from './cfg/app.parameters.json';
import batiments from './cfg/batiment-colors.json';
import { BatimentDto } from './dto/batimentDto';

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
  //batiment = 'no-image';
  currentBatiment: BatimentDto = {
    name: 'no-image',
    cout: 0,
  };
  // S, SE, NE, N, NO, SO
  currentColors: string[] = ['', '', '', '', '', ''];
  adjCounter = 0;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.colorerTuileDepart();
    // this.colorerTuileCurrent();
    this.fillTuileCurrent();
  }

  colorerTuileDepart(): void {
    for (let i = 0; i < 6; i++) {
      if (i >= 4) this.tileService.coloreCote('510', i + 1, 'w');
      else if (i >= 2) this.tileService.coloreCote('510', i + 1, 's');
      else this.tileService.coloreCote('510', i + 1, 'g');
    }
    this.tileService.findTuilesAdjacentes(5, 10, this.adjCounter);
  }

  setCurrentColors() {
    //console.log('batimentcourrant', this.currentBatiment);
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
            console.log('AAAAA', this.currentColors[i]);
          }
        }
      }
    }
    console.log(this.currentColors);
    this.currentColors = this.shuffle(this.currentColors);
    console.log(this.currentColors);
    // console.log('couleurscourantes', this.currentColors);
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
    let batimentsFiltre = batiments.batiments.filter(
      (b) => b.cout === this.adjCounter
    );
    this.currentBatiment =
      batimentsFiltre[Math.floor(Math.random() * batimentsFiltre.length)];
    this.tileService.placerBatiment(`500500`, this.currentBatiment.name);

    // remplir couleurs
    this.setCurrentColors();
    //console.log(this.currentColors);
    for (let i = 0; i < 6; i++) {
      this.tileService.coloreCote('500500', i + 1, this.currentColors[i]);
    }

    // console.log(batiments.batiments);
    // console.log(batimentsFiltre);
    // console.log(this.currentBatiment);
    // //this.colorerTuileCurrent();
  }
  /**
   * remplir le hex cliqué avec le hex courant
   * @param hHex
   * @param vHex
   */
  hexClick(hHex: any, vHex: any) {
    console.log(`click sur la tuile ${hHex}${vHex}`);

    // Colorier les 6 cotés
    for (let i = 0; i < 6; i++) {
      this.tileService.coloreCote(
        `${hHex}${vHex}`,
        i + 1,
        this.currentColors[i]
      );
    }

    // Placer le batiment
    this.tileService.placerBatiment(
      `${hHex}${vHex}`,
      this.currentBatiment.name
    );

    this.adjCounter = this.tileService.findTuilesAdjacentes(
      hHex,
      vHex,
      this.adjCounter
    );

    // Reinitialiser la tuile courante et le batiment
    //this.colorerTuileCurrent();
    this.fillTuileCurrent();
  }

  /**
   * A bouger quand le sotore arrivera
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
