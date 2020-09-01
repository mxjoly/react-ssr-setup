import { Middleware } from 'redux';
import { configureStore } from './index';
import { initialRootState } from './rootReducer';

const middlewares: Middleware[] = [];

describe('Store', () => {
  describe('#configureStore', () => {
    it('should have the initial state', () => {
      const store = configureStore({ initialState: {}, middlewares });
      expect(store.getState()).toStrictEqual(initialRootState);
    });

    it('should merge the preload state to the initial state', () => {
      const preloadState = { app: { test: 'test' } };
      const store = configureStore({ initialState: preloadState, middlewares });
      expect(store.getState()).toStrictEqual({
        ...initialRootState,
        ...preloadState,
      });
    });
  });
});
