import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useSSR } from 'react-i18next';

import '../shared/i18n';
import App from '../shared/App';
import configureStore from '../shared/store';

// Grab the state from a global variable injected into the server-generated HTML
const preloadState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

// Create Redux store with initial state or use the store
const store = window.store || configureStore({ initialState: preloadState });

const BaseApp = () => {
  useSSR(window.initialI18nStore, window.initialLanguage);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  );
};

hydrate(<BaseApp />, document.getElementById('app'));

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }

  if (!window.store) {
    window.store = store;
  }
}
