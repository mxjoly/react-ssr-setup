import * as selectors from './selectors';
import rootReducer, { RootState } from '../rootReducer';

describe('App selectors', () => {
  let fullState: RootState;

  beforeEach(() => {
    fullState = rootReducer(undefined, { type: 'undefined' });
  });

  it('have a selector to get the branch of the state', () => {
    const state = selectors.getApp(fullState);
    expect(state).toEqual(fullState.app);
  });
  it('have a selector to return the locale', () => {
    expect(selectors.getLocale(fullState)).toBe(fullState.app.locale);
  });
});
