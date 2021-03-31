import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useSSR } from 'react-i18next';
import cookie from 'js-cookie';

import '../shared/lib/i18n';
import config from '../shared/lib/i18n/config';
import App from '../shared/App';
import { configureStore } from '../shared/lib/store';
import * as ServiceWorker from './setupWorker';

// Grab the state from a global variable injected into the server-generated HTML
const preloadState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

// Get the initial language
const initialLanguage =
  config.detection.caches.includes('cookie') &&
  config.detection.order.includes('cookie')
    ? cookie.get(config.detection.lookupCookie) || window.initialLanguage
    : window.initialLanguage;

// Create Redux store with initial state or use the store
const store = window.store || configureStore({ initialState: preloadState });

const BaseApp = () => {
  useSSR(window.initialI18nStore, initialLanguage);
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

hydrate(<BaseApp />, document.querySelector('#app'));

if (process.env.PWA === 'true') {
  ServiceWorker.register();
}

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }

  if (!window.store) {
    window.store = store;
  }
}
