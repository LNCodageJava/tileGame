import { Component, OnInit } from '@angular/core';
import { GlobalState, StateKeys } from '../store/global.state';
import { GlobalStore } from '../store/global.store';
import { Store } from '@elie29/store';
import { TileService } from '../services/tile.service';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss'],
})
export class DiceComponent implements OnInit {
  constructor(private store: GlobalStore, private tileService: TileService) {}
  result: number = 0;
  ngOnInit(): void {
    let myDiceValues = ['one', 'two', 'three', 'four', 'five', 'six'];
    var button = document.getElementById('die');

    button!.addEventListener(
      'click',
      () => {
        button!.classList.remove('spin');
        void button!.offsetWidth;
        button!.classList.add('spin');
        this.result = Math.floor(Math.random() * myDiceValues.length);
        setTimeout(() => {
          if (button) {
            button.className = 'spin';
            button.classList.add(myDiceValues[this.result]);
          }
          this.store.set(StateKeys.MODE, 'dice');
          this.store.set(StateKeys.DICE_RESULT, this.result);
          this.tileService.setCurrentTileMode('no-image', 'arrow');
        }, 1000);
      },
      false
    );
  }
}
