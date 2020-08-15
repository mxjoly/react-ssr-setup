import { produce } from 'immer';
import { ActionTypes } from './actions';
import { Action, AppState } from './types';

export const initialState = Object.freeze<AppState>({
  locale: 'en_US',
});

export default (state: AppState = initialState, action: Action): AppState =>
  produce(state, (draftState) => {
    switch (action.type) {
      case ActionTypes.SET_LOCALE: {
        draftState.locale = action.payload;
        return;
      }
    }
  });
