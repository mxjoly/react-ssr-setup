import React from 'react';
import { Request, Response } from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';

import App from '../../shared/App';
import Html from '../components/html';

const routerContext = {};
const helmetContext = {};

const renderFullPage = () => (req: Request, res: Response) => {
  const content = renderToString(
    <Provider store={res.locals.store}>
      <Router location={req.url} context={routerContext}>
        <HelmetProvider context={helmetContext}>
          <App />
        </HelmetProvider>
      </Router>
    </Provider>
  );

  // redux.js.org/recipes/server-rendering#security-considerations
  const state = serialize(res.locals.store.getState());

  return res.send(
    '<!doctype html>' +
      renderToString(
        <Html
          css={[
            res.locals.assetPath('bundle.css'),
            res.locals.assetPath('vendor.css'),
          ]}
          scripts={[
            res.locals.assetPath('bundle.js'),
            res.locals.assetPath('vendor.js'),
          ]}
          helmetContext={helmetContext}
          state={state}
        >
          {content}
        </Html>
      )
  );
};

export default renderFullPage;
