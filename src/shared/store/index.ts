import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import createRootReducer from './rootReducer';

type StoreParams = {
  initialState?: { [key: string]: any };
  middleware?: any[];
};

export const configureStore = ({
  initialState,
  middleware = [],
}: StoreParams) => {
  // https://github.com/zalmoxisus/redux-devtools-extension#1-with-redux
  const devtools =
    typeof window !== 'undefined' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: [] });

  const composeEnhancers = devtools || compose;

  const enhancer = composeEnhancers(
    applyMiddleware(...[thunk].concat(...middleware))
  );

  const store = createStore(createRootReducer(), initialState, enhancer);

  // https://redux.js.org/recipes/configuring-your-store#hot-reloading
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./rootReducer', () =>
      store.replaceReducer(require('./rootReducer').default)
    );
  }

  return store;
};

export default configureStore;
