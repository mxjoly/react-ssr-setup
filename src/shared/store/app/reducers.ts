import { produce } from 'immer';
import { ActionTypes } from './actions';
import { Action, AppState } from './types';
import config from '../../i18n/config';

export const initialState = Object.freeze<AppState>({
  locale: config.fallbackLng,
});

export default (state: AppState = initialState, action: Action): AppState =>
  produce(state, (draft) => {
    switch (action.type) {
      case ActionTypes.SET_LOCALE: {
        draft.locale = action.payload;
        return;
      }
    }
  });
