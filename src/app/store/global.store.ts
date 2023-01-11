import { GlobalState } from './global.state';
import { Store } from '@elie29/store';
import { INITIAL_STATE } from './global.state';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalStore extends Store<GlobalState> {
  constructor() {
    super(INITIAL_STATE);
  }
}
