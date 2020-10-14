/**
 * @jest-environment jsdom
 */
import { Middleware } from 'redux';
import { configureStore } from '.';
import { initialRootState } from './rootReducer';

const middlewares: Middleware[] = [];

describe('Store', () => {
  describe('#configureStore', () => {
    it('has the initial state', () => {
      const store = configureStore({ initialState: {}, middlewares });
      expect(store.getState()).toStrictEqual(initialRootState);
    });

    it('merges the preload state to the initial state', () => {
      const preloadState = { app: { test: 'test' } };
      const store = configureStore({ initialState: preloadState, middlewares });
      expect(store.getState()).toStrictEqual({
        ...initialRootState,
        ...preloadState,
      });
    });
  });
});
