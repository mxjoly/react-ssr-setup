import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from '../shared/store';
import App from '../shared/App';

// Use or create the store
const store =
  window.store ||
  configureStore({
    initialState: window.__PRELOADED_STATE__,
  });

hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }

  if (!window.store) {
    window.store = store;
  }
}
