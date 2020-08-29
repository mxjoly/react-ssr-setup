import { combineReducers } from 'redux';

import app from './app/reducers';

import { AppState } from './app/types';

export type RootState = Readonly<{
  app: AppState;
}>;

export default combineReducers({
  app,
});
