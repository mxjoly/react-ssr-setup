import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';
import { AppState, Locale } from './types';

export const getApp = (state: RootState): AppState => state.app;

export const getLocale = createSelector([getApp], (app): Locale => app.locale);
