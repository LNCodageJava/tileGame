import { State } from '@elie29/store';

export enum StateKeys {
  DICE_RESULT = 'diceResult',
}
export interface GlobalState extends State {
  diceResult: number;
}

export const INITIAL_STATE: GlobalState = {
  diceResult: 0,
};
