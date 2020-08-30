import { combineReducers } from 'redux';

import app from './app/reducer';
import user from './user/reducer';

import { AppState } from './app/types';
import { UserState } from './user/types';

export type RootState = Readonly<{
  app: AppState;
  user: UserState;
}>;

export default combineReducers<RootState>({ app, user });
