import React from 'react';
import { Request, Response } from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';

import App from '../../shared/App';
import Html from '../components/html';

const routerContext: any = {};
const helmetContext: any = {};

const renderFullPage = () => (req: Request, res: Response) => {
  const content = renderToString(
    <Provider store={res.locals.store}>
      <Router location={req.url} context={routerContext}>
        <I18nextProvider i18n={req.i18n}>
          <HelmetProvider context={helmetContext}>
            <App />
          </HelmetProvider>
        </I18nextProvider>
      </Router>
    </Provider>
  );

  // redux.js.org/recipes/server-rendering#security-considerations
  const state = serialize(res.locals.store.getState());

  // Initialize the store and the initial language
  const initialI18nStore: any = {};
  req.i18n.languages.forEach((l: string) => {
    initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
  });
  const initialLanguage = req.i18n.language;

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
          initialI18nStore={initialI18nStore}
          initialLanguage={initialLanguage}
        >
          {content}
        </Html>
      )
  );
};

export default renderFullPage;
