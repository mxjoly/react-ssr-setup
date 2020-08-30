import { Locale } from './types';

export const ActionTypes = {
  SET_LOCALE: '/app/set-locale',
};

export const setLocale = (locale: Locale) => ({
  type: ActionTypes.SET_LOCALE,
  payload: locale,
});
