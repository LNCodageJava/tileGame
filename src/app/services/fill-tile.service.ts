import { Injectable } from '@angular/core';
import { TuileDto } from '../dto/tuileDto';
import { StateKeys } from '../store/global.state';
import { GlobalStore } from '../store/global.store';
import batiments from '../cfg/batiment-colors3.json';

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
    var divIndex = document.getElementById(`${idTuile}_index`) as HTMLElement;
    batimentArray === batiments.pool
      ? (divIndex.innerHTML = 'p' + batimentIndex)
      : (divIndex.innerHTML = 'w' + batimentIndex);

    this.setTuileData(
      idTuile,
      batimentArray[batimentIndex].name,
      batimentArray[batimentIndex].color,
      batimentArray[batimentIndex].cost,
      batimentArray[batimentIndex].max,
      batimentArray[batimentIndex].multi,
      batimentArray[batimentIndex].reward,
      batimentIndex
    );
  }
  setTuileData(
    idTuile: string,
    batiment: string,
    color: string,
    cost: string,
    max: string,
    multi: string,
    reward: string,
    batimentIndex: number
  ) {
    var img = document.getElementById(`${idTuile}_batiment`) as HTMLImageElement;
    img.src = `assets/batiments/${batiment}.png`;

    var img = document.getElementById(`${idTuile}_couleur`) as HTMLImageElement;
    img.src = `assets/textures/${color}.png`;

    var ele = document.getElementById(`${idTuile}_corner`) as HTMLElement;
    ele.setAttribute('style', 'display:flex');

    this.setRewardMulti(idTuile, reward, multi);
    this.setCostMax(idTuile, cost, max);
  }

  getPlayer(player: any) {
    this.player = player;
  }

  setRewardMulti(idTuile: string, reward: string, multi: string) {
    this.logos = [];
    let innerHTML = '';

    // MULTI
    let multiName;
    switch (multi) {
      case 'w':
        multiName = 'waterlogo';
        break;
      case 'g':
        multiName = 'leaflogo';
        break;
      case 's':
        multiName = 'sandlogo';
        break;
      case 'x':
        multiName = 'multicolorlogo';
        break;
      case 'a':
        multiName = 'allylogo';
        break;
      case 'e':
        multiName = 'foelogo';
        break;
      default:
        multiName = 'no-image';
        break;
    }
    innerHTML = innerHTML + `<img src="assets/textures/${multiName}.png" class="multi" />`;

    // REWARD
    for (let i = 0; i < reward.length; i++) {
      let eleSymbol = reward.slice(i, i + 1);
      let elementName;
      switch (eleSymbol) {
        case 'w':
          elementName = 'carrewater';
          break;
        case 'g':
          elementName = 'carreleaf';
          break;
        case 's':
          elementName = 'carresand';
          break;
        case 'v':
          elementName = 'carrevictory';
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
          elementName = 'no-image';
          break;
      }
      innerHTML = innerHTML + `<img src="assets/textures/${elementName}.png" class="reward" />`;
    }
    let ele = document.getElementById(`${idTuile}_cost-container`) as HTMLElement;
    ele.innerHTML = innerHTML;
    // ele.innerHTML = `<span class="b_cost"> ${objCost[0]} </span>`;
    // ele.innerHTML = `<span class="v_cost"> ${objCost[1]}</span>`;
    // ele.innerHTML = `<span class="j_cost"> ${objCost[2]} </span>`;
  }

  setCostMax(idTuile: string, cost: string, max: string) {
    let ele = document.getElementById(`${idTuile}_w_cost`) as HTMLElement;
    ele.innerHTML = cost[0];
    let ele2 = document.getElementById(`${idTuile}_g_cost`) as HTMLElement;
    ele2.innerHTML = cost[1];
    let ele3 = document.getElementById(`${idTuile}_s_cost`) as HTMLElement;
    ele3.innerHTML = cost[2];
    let ele4 = document.getElementById(`${idTuile}_max`) as HTMLElement;
    ele4.innerHTML = max;
  }

  // fillArray(idTuile: string, nb: string, elementName: string) {
  //   var ele = document.getElementById(`${idTuile}_cost-container`) as HTMLElement;
  //   for (let i = 0; i < parseInt(nb); i++) {
  //     ele.innerHTML = `<img src="assets/textures/${elementName}.png" class="logo" />`;
  //   }
  // }

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

  // placerJetonPlayer(idTuile: string, isBlack: boolean) {
  //   var div = document.getElementById(`${idTuile}_player`);
  //   console.log(this.player);
  //   let tuileGauche = (idTuile.length > 3 && idTuile.slice(0, 2) == '40') || idTuile.slice(0, 2) == '50';
  //   if (div && !isBlack && !tuileGauche) {
  //     if (this.player?.active) {
  //       console.log('p1');
  //       div.style.backgroundColor = this.player.color;
  //     } else {
  //       console.log('p2');
  //       div.style.backgroundColor = 'orange';
  //     }
  //   } else if (div) {
  //     console.log('rien');
  //     div.style.backgroundColor = 'transparent';
  //   }
  // }
}
