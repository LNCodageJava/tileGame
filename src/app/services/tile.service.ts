import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TileService {
  constructor() {}

  coloreCote(idTuile: number, cote: number, couleur: string): void {
    var t1 = document.getElementById(`${idTuile}_${cote}`);
    if (t1) {
      t1.style.borderColor = `transparent transparent ${couleur} transparent`;
    }
  }
}
