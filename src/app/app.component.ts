import { Component, OnInit } from '@angular/core';
import { TileService } from './services/tile.service';
import parameters from './cfg/app.parameters.json';

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
  batiment = 'no-image';
  currentBatiment = 'no-image';
  currentColors: string[] = [];

  ngOnInit(): void {
    console.log(this.gridSizeX);
  }

  ngAfterViewInit(): void {
    var t1 = document.getElementById('12_1');
    if (t1 != null) {
      t1.style.borderColor =
        'transparent transparent rgba(255, 0, 0, 0.425) transparent';
    }

    //var t1 = document.getElementById('12_1');
    this.colorerTuileDepart();
    this.colorerTuileCurrent();
    this.placerBatimentTuileCurrent();
  }

  colorerTuileDepart(): void {
    for (let i = 0; i <= 6; i++) {
      if (i <= 2) this.tileService.coloreCote('510', i, 'yellow');
      else if (i <= 4) this.tileService.coloreCote('510', i, 'blue');
      else if (i <= 6) this.tileService.coloreCote('510', i, 'green');
    }
  }

  colorerTuileCurrent() {
    console.log(parameters.colors);
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

    console.log(this.currentColors);

    for (let i = 0; i <= 6; i++) {
      this.tileService.coloreCote('500500', i + 1, this.currentColors[i]);
    }
  }

  placerBatimentTuileCurrent() {
    this.currentBatiment =
      parameters.batiments[
        Math.floor(Math.random() * parameters.batiments.length)
      ];
  }

  hexClick(hHex: any, vHex: any) {
    console.log(`click sur la tuile ${hHex}${vHex}`);

    // Colorier les 6 cotés
    for (let i = 0; i <= 6; i++) {
      this.tileService.coloreCote(
        `${hHex}${vHex}`,
        i + 1,
        this.currentColors[i]
      );
    }

    // Placer le batiment
    this.tileService.placerBatiment(`${hHex}${vHex}`, this.currentBatiment);

    // Reinitialiser la tuile courante et le batiment
    this.colorerTuileCurrent();
    this.placerBatimentTuileCurrent();
  }
}
