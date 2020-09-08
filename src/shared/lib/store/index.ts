import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';

type StoreParams = {
  initialState?: { [key: string]: any };
  middlewares?: any[];
};

export const configureStore = ({
  initialState,
  middlewares = [],
}: StoreParams) => {
  // https://github.com/zalmoxisus/redux-devtools-extension#1-with-redux
  /* istanbul ignore next */
  const devtools =
    typeof window !== 'undefined' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: [] });

  const composeEnhancers = devtools || compose;

  const enhancer = composeEnhancers(
    applyMiddleware(...[thunk].concat(...middlewares))
  );

  const store = createStore(rootReducer, initialState, enhancer);

  // https://redux.js.org/recipes/configuring-your-store#hot-reloading
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./rootReducer', () =>
      store.replaceReducer(require('./rootReducer').default)
    );
  }

  return store;
};
