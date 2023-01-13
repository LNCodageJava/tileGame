import { State } from '@elie29/store';

export enum StateKeys {
  DICE_RESULT = 'diceResult',
  MODE = 'mode',
}
export interface GlobalState extends State {
  diceResult: number;
  mode: string;
}

export const INITIAL_STATE: GlobalState = {
  diceResult: 0,
  mode: 'normal',
};
