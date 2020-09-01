import { combineReducers } from 'redux';

import app, { initialState as appInitialState } from './app/reducer';

import { AppState } from './app/types';

export type RootState = Readonly<{
  app: AppState;
}>;

export const initialRootState: RootState = {
  app: appInitialState,
};

export default combineReducers<RootState>({ app });
