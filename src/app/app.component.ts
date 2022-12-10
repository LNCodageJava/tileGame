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
  currentColors: string[] = [];
  adjCounter = 0;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.colorerTuileDepart();
    this.colorerTuileCurrent();
    this.placerBatimentTuileCurrent();
  }

  colorerTuileDepart(): void {
    this.randomColoring();
    for (let i = 0; i < 6; i++) {
      this.tileService.coloreCote('510', i + 1, this.currentColors[i]);
      this.tileService.findTuilesAdjacentes(5, 10, this.adjCounter);
    }
  }

  colorerTuileCurrent() {
    this.randomColoring();
    //console.log(this.currentColors);
    for (let i = 0; i < 6; i++) {
      this.tileService.coloreCote('500500', i + 1, this.currentColors[i]);
    }
  }

  randomColoring() {
    this.currentColors[0] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
    this.currentColors[1] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
    this.currentColors[2] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
    this.currentColors[3] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
    this.currentColors[4] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
    this.currentColors[5] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
  }

  placerBatimentTuileCurrent() {
    let batimentsFiltre = batiments.batiments.filter(
      (b) => b.cout === this.adjCounter
    );
    this.currentBatiment =
      batimentsFiltre[Math.floor(Math.random() * batimentsFiltre.length)];
    console.log(batiments.batiments);
    console.log(batimentsFiltre);
    console.log(this.currentBatiment);
    //this.colorerTuileCurrent();
    this.tileService.placerBatiment(`500500`, this.currentBatiment.name);
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
    this.colorerTuileCurrent();
    this.placerBatimentTuileCurrent();
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
