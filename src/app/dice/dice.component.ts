import { Component, OnInit } from '@angular/core';
import { GlobalState, StateKeys } from '../store/global.state';
import { GlobalStore } from '../store/global.store';
import { Store } from '@elie29/store';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss'],
})
export class DiceComponent implements OnInit {
  constructor(private store: GlobalStore) {}
  result: number = 0;
  ngOnInit(): void {
    console.log(this.store.get(StateKeys.DICE_RESULT));
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
          console.log(this.result);
          this.store.set(StateKeys.DICE_RESULT, this.result);
        }, 1000);
      },
      false
    );
  }
}
