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
      batimentArray[batimentIndex].contr,
      batimentArray[batimentIndex].type,
      batimentArray[batimentIndex].multi,
      batimentArray[batimentIndex].reward,
      batimentIndex
    );
  }
  setTuileData(
    idTuile: string,
    batiment: string,
    color: string,
    contr: string,
    type: string,
    multi: string,
    reward: string,
    batimentIndex: number
  ) {
    var img = document.getElementById(`${idTuile}_batiment`) as HTMLImageElement;
    img.src = `assets/batiments/${batiment}.png`;

    var img = document.getElementById(`${idTuile}_couleur`) as HTMLImageElement;
    img.src = `assets/textures/${color}.png`;

    this.setRewardMulti(idTuile, reward, multi, type);
    this.setContraintes(idTuile, reward, contr);
    //this.setCostMax(idTuile, cost, max);
  }

  getPlayer(player: any) {
    this.player = player;
  }

  setRewardMulti(idTuile: string, reward: string, multi: string, type: string) {
    this.logos = [];
    let innerHTML = '';
    let multis = '';

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
        multiName = 'skylogo';
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
    multis = multis + `<img src="assets/textures/${multiName}.png" class="multi" />`;

    // TYPE
    let typeName;
    switch (type) {
      case 'a':
        typeName = 'adj';
        break;
      case 'h':
        typeName = 'ligneh';
        break;
      case 'v':
        typeName = 'lignev';
        break;
      case 'c':
        typeName = 'cross';
        break;
      case 'g':
        typeName = 'group';
        break;
    }
    multis = multis + `<img src="assets/textures/${typeName}.png" class="multi" />`;
    innerHTML = innerHTML + `<div class="connect"></div><div class="multis-wrapper">${multis}</div>`;

    // REWARD
    let rewards = '';
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
      rewards = rewards + `<img src="assets/textures/${elementName}.png" class="reward" />`;
    }
    innerHTML = innerHTML + `<div class="reward-wrapper">${rewards}</div>`;
    let ele = document.getElementById(`${idTuile}_cost-container`) as HTMLElement;
    ele.innerHTML = innerHTML;
  }

  setContraintes(idTuile: string, reward: string, contr: string) {
    // earth
    if (reward[0] !== 'v') {
      let innerHTML = '';

      let contrw = contr[0];
      if (contrw !== ' ') {
        innerHTML =
          innerHTML + `<div class="contr" style="background-image:url(assets/textures/waterlogo.png);">${contrw}</div>`;
      }

      let contrg = contr[1];
      if (contrg !== ' ') {
        innerHTML =
          innerHTML + `<div class="contr" style="background-image:url(assets/textures/leaflogo.png);">${contrg}</div>`;
      }

      let contrs = contr[2];
      if (contrs !== ' ') {
        innerHTML =
          innerHTML + `<div class="contr" style="background-image:url(assets/textures/sandlogo.png);">${contrs}</div>`;
      }

      let ele = document.getElementById(`${idTuile}_contr`) as HTMLElement;
      ele.innerHTML = innerHTML;
    }
    // sky
    else {
      let innerHTML = '';

      let contrw = contr[0];
      if (contrw !== ' ') {
        innerHTML =
          innerHTML +
          `<div class="card-sky"><span class="number-sky">${contrw}</span><img src="assets/textures/carrewater.png" class="contr-sky" /></div>`;
      }

      let contrg = contr[1];
      if (contrg !== ' ') {
        innerHTML =
          innerHTML +
          `<div class="card-sky"><span class="number-sky">${contrg}</span><img src="assets/textures/carreleaf.png" class="contr-sky" /></div>`;
      }

      let contrs = contr[2];
      if (contrs !== ' ') {
        innerHTML =
          innerHTML +
          `<div class="card-sky"><span class="number-sky">${contrs}</span><img src="assets/textures/carresand.png" class="contr-sky" /></div>`;
      }

      let ele = document.getElementById(`${idTuile}_contr-sky`) as HTMLElement;
      ele.innerHTML = innerHTML;
    }
  }

  setCostMax(idTuile: string, cost: string, max: string) {
    // let ele = document.getElementById(`${idTuile}_w_cost`) as HTMLElement;
    // ele.innerHTML = cost[0];
    // let ele2 = document.getElementById(`${idTuile}_g_cost`) as HTMLElement;
    // ele2.innerHTML = cost[1];
    // let ele3 = document.getElementById(`${idTuile}_s_cost`) as HTMLElement;
    // ele3.innerHTML = cost[2];
    //    let ele4 = document.getElementById(`${idTuile}_max`) as HTMLElement;
    //  ele4.innerHTML = max;
  }
}
