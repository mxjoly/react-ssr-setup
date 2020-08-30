import reducer, { initialState } from './reducer';
import { ActionTypes } from './actions';

describe('App reducer', () => {
  it('should return the initial state', () => {
    const receivedState = reducer(undefined, { type: 'undefined' });
    expect(receivedState).toEqual(initialState);
  });

  it('should handle SET_LOCALE', () => {
    const receivedState = reducer(undefined, {
      type: ActionTypes.SET_LOCALE,
      payload: 'fr',
    });
    const expectedState = { ...initialState, locale: 'fr' };
    expect(receivedState).toEqual(expectedState);
  });
});
