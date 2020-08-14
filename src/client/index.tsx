import React from 'react';
import { hydrate } from 'react-dom';
import App from '../shared/App';

hydrate(<App />, document.getElementById('app'));

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }
}
