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
  }

  colorerTuileDepart(): void {
    for (let i = 0; i <= 6; i++) {
      if (i <= 2) this.tileService.coloreCote(510, i, 'yellow');
      else if (i <= 4) this.tileService.coloreCote(510, i, 'blue');
      else if (i <= 6) this.tileService.coloreCote(510, i, 'green');
    }
  }

  colorerTuileCurrent() {
    console.log(parameters.colors);
    const colors = [];
    colors[0] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
    colors[1] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
    colors[2] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
    colors[3] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
    colors[4] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
    colors[5] =
      parameters.colors[Math.floor(Math.random() * parameters.colors.length)];

    console.log(colors);

    for (let i = 0; i <= 6; i++) {
      this.tileService.coloreCote(500500, i + 1, colors[i]);
    }
  }
}
