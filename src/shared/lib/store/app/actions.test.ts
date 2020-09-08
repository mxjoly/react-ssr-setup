import { setLocale, ActionTypes } from './actions';
import { Action } from './types';

describe('App actions', () => {
  it('have an action to add a locale', () => {
    const locale = 'en';
    const expectedAction: Action = {
      type: ActionTypes.SET_LOCALE,
      payload: locale,
    };
    expect(setLocale(locale)).toEqual(expectedAction);
  });
});
