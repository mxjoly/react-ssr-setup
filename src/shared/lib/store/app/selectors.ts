import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';
import { AppState, Locale } from './types';

export const app = (state: RootState): AppState => state.app || {};

export const getLocale = createSelector(
  [app],
  (app): Locale | undefined => app.locale || undefined
);
