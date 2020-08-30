import { produce } from 'immer';
import { ActionTypes } from './actions';
import { Action, UserState } from './types';

export const initialState: UserState = Object.freeze({
  didInvalidate: false,
  isLoading: false,
  items: [],
  updatedAt: null,
});

export default (state: UserState = initialState, action: Action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ActionTypes.USER_REQUEST:
        draft.isLoading = true;
        return;

      case ActionTypes.USER_SUCCESS:
        draft.didInvalidate = false;
        draft.updatedAt = action.payload?.updatedAt || Number(Date.now());
        draft.items = action.payload?.items || [];
        draft.isLoading = false;
        return;

      case ActionTypes.USER_FAILURE:
        draft.didInvalidate = true;
        draft.isLoading = false;
        return;

      case ActionTypes.USER_INVALIDATE:
        draft.didInvalidate = true;
        return;
    }
  });
