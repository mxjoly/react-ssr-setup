import * as selectors from './selectors';
import rootReducer from '../rootReducer';

const fullState = rootReducer(undefined, { type: 'undefined' });

describe('App selectors', () => {
  it('should select the App branch of the state', () => {
    const state = selectors.getApp(fullState);
    expect(state).toEqual(fullState.app);
  });
  it('getLocale should return the locale', () => {
    expect(selectors.getLocale(fullState)).toBe(fullState.app.locale);
  });
});
