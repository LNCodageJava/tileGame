import { Injectable } from '@angular/core';
import { TuileDto } from '../dto/tuileDto';
import { StateKeys } from '../store/global.state';
import { GlobalStore } from '../store/global.store';
import batiments from '../cfg/batiment-colors.json';

@Injectable({
  providedIn: 'root',
})
export class FillTileService {
  logos: string[] = [];
  pointsLogo: string = '';
  points = '0';
  power = '';
  player: any;

  generate(idTuile: string, batimentIndex: any, batimentArray: any[]) {
    //console.log('generation de la tuile:' + this.TILE_NUMBER);
    console.log(idTuile);
    var divIndex = document.getElementById(`${idTuile}_index`) as HTMLElement;

    batimentArray === batiments.hand
      ? (divIndex.innerHTML = 'h' + batimentIndex)
      : (divIndex.innerHTML = 'p' + batimentIndex);

    this.setTuileData(
      idTuile,
      batimentArray[batimentIndex].name,
      batimentArray[batimentIndex].color,
      batimentArray[batimentIndex].points,
      batimentArray[batimentIndex].cost,
      batimentArray[batimentIndex].power,
      batimentIndex
    );
  }
  setTuileData(
    idTuile: string,
    batiment: string,
    color: string,
    points: string,
    cost: string,
    power: string,
    batimentIndex: number
  ) {
    var img = document.getElementById(`${idTuile}_batiment`) as HTMLImageElement;
    img.src = `assets/batiments/${batiment}.png`;

    var img = document.getElementById(`${idTuile}_couleur`) as HTMLImageElement;
    img.src = `assets/textures/${color}.png`;

    var ele = document.getElementById(`${idTuile}_point`) as HTMLElement;
    if (color === 'w' || batimentIndex === 27) {
      ele.setAttribute('style', 'color:#0002A3!important');
    } else if (color === 'g' || batimentIndex === 28) {
      ele.setAttribute('style', 'color:#33cc33!important');
    } else if (color === 's' || batimentIndex === 29) {
      ele.setAttribute('style', 'color:#EFCA08!important');
    }

    this.setPoints(idTuile, points, power);

    this.setCost(idTuile, cost);
  }

  getPlayer(player: any) {
    console.log(player);
    this.player = player;
  }

  setCost(idTuile: string, cost: string) {
    this.logos = [];
    let nbWaterLogo = cost.slice(0, 1);
    console.log(cost.length);
    let innerHTML = '';
    let objCost = [];
    for (let i = 0; i < cost.length; i++) {
      let eleSymbol = cost.slice(i, i + 1);
      let elementName;
      switch (eleSymbol) {
        case 'w':
          elementName = 'waterlogo';
          break;
        case 'g':
          elementName = 'leaflogo';
          break;
        case 's':
          elementName = 'sandlogo';
          break;
        case 'x':
          elementName = 'multicolorlogo';
          break;
        case 'a':
          elementName = 'allylogo';
          break;
        case 'e':
          elementName = 'foelogo';
          break;
        default:
          objCost[i] = eleSymbol;
          elementName = 'no-image';
          break;
      }
      innerHTML = innerHTML + `<img src="assets/textures/${elementName}.png" class="logo" />`;
    }
    var ele = document.getElementById(`${idTuile}_cost-container`) as HTMLElement;
    ele.innerHTML = innerHTML;

    var ele = document.getElementById(`${idTuile}_obj`) as HTMLElement;
    ele.innerHTML = `<span class="number"> ${objCost[0]} &nbsp; ${objCost[1]} &nbsp; ${objCost[2]} </span>`;
    if (objCost.length > 0) {
      ele.setAttribute('style', 'display:flex');
      var ele = document.getElementById(`${idTuile}_point`) as HTMLElement;
      ele.setAttribute('style', 'color:#FF7D00!important');
    }
  }

  setPoints(idTuile: string, points: string, power: string) {
    let pointLogo = points.slice(2, 3);
    let isBlack = false;
    // this.placerJetonPlayer(idTuile, isBlack);
    console.log(pointLogo);
    switch (pointLogo) {
      case 'a':
        this.pointsLogo = 'allylogo';
        break;
      case 'e':
        this.pointsLogo = 'foelogo';
        break;
      case 'w':
        this.pointsLogo = 'waterlogo';
        break;
      case 's':
        this.pointsLogo = 'sandlogo';
        break;
      case 'g':
        this.pointsLogo = 'leaflogo';
        break;
      case 'f':
        this.pointsLogo = 'fulllogo';
        break;
      default:
        this.pointsLogo = 'fulllogo';
        break;
    }
    if (pointLogo === 'a' || pointLogo === 'e' || pointLogo === 'w' || pointLogo === 's' || pointLogo === 'g') {
      var img = document.getElementById(`${idTuile}_point-logo`) as HTMLImageElement;
      img.src = `assets/textures/${this.pointsLogo}.png`;

      this.points = points.slice(1, 2);
      var ele = document.getElementById(`${idTuile}_point`) as HTMLElement;
      ele.className = 'point';
      ele.innerHTML = this.points;
      // ele.setAttribute('style', 'color: white!important;');

      var img = document.getElementById(`${idTuile}_corner`) as HTMLImageElement;
      isBlack ? (img.src = `assets/textures/corner-black.png`) : (img.src = `assets/textures/corner.png`);
      var img = document.getElementById(`${idTuile}_power`) as HTMLImageElement;
      img.src = `assets/textures/no-image.png`;
    } else {
      var img = document.getElementById(`${idTuile}_corner`) as HTMLImageElement;
      isBlack ? (img.src = `assets/textures/corner-empty-black.png`) : (img.src = `assets/textures/corner-empty.png`);
      this.points = points.slice(1, 2);
      var img = document.getElementById(`${idTuile}_point-logo`) as HTMLImageElement;
      img.src = `assets/textures/${this.pointsLogo}.png`;
      var ele = document.getElementById(`${idTuile}_point`) as HTMLElement;
      ele.className = 'point-empty';
      ele.innerHTML = this.points;
      var img = document.getElementById(`${idTuile}_power`) as HTMLImageElement;
      img.src = `assets/textures/no-image.png`;
    }

    if (power != '') {
      var img = document.getElementById(`${idTuile}_corner`) as HTMLImageElement;
      isBlack ? (img.src = `assets/textures/corner-power-black.png`) : (img.src = `assets/textures/corner-power.png`);
      var img = document.getElementById(`${idTuile}_power`) as HTMLImageElement;
      img.src = `assets/textures/${power}.png`;
    }

    var ele = document.getElementById(`${idTuile}_point`) as HTMLElement;

    // ? ele.setAttribute('style', 'color: white!important;')
    // : ele.setAttribute('style', 'color: black!important;');

    var ele = document.getElementById(`${idTuile}_cost-container`) as HTMLElement;
  }

  fillArray(idTuile: string, nb: string, elementName: string) {
    console.log(idTuile, nb);
    var ele = document.getElementById(`${idTuile}_cost-container`) as HTMLElement;
    for (let i = 0; i < parseInt(nb); i++) {
      console.log(ele);
      ele.innerHTML = `<img src="assets/textures/${elementName}.png" class="logo" />`;
    }
  }

  // getBatimentIndex(idTuile: string): number {
  //   let index;
  //   let batimentTargetTuile = document.getElementById(`${idTuile}_index`) as HTMLImageElement;
  //   let batimentName = batimentTargetTuile.src.slice(39, batimentTargetTuile.src.length - 4);

  //   console.log(batimentName);
  //   if (true) {
  //     index = batiments.pool.findIndex((i) => i.name == batimentName);
  //   } else {
  //     index = batiments.hand.findIndex((i) => i.name == batimentName);
  //   }
  //   return index;
  // }

  placerJetonPlayer(idTuile: string, isBlack: boolean) {
    var div = document.getElementById(`${idTuile}_player`);
    console.log(this.player);
    let tuileGauche = (idTuile.length > 3 && idTuile.slice(0, 2) == '40') || idTuile.slice(0, 2) == '50';
    if (div && !isBlack && !tuileGauche) {
      if (this.player?.active) {
        console.log('p1');
        div.style.backgroundColor = this.player.color;
      } else {
        console.log('p2');
        div.style.backgroundColor = 'orange';
      }
    } else if (div) {
      console.log('rien');
      div.style.backgroundColor = 'transparent';
    }
  }
}
