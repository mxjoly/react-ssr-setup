import React from 'react';
import path from 'path';
import { Request, Response } from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';

import App from '../../shared/App';
import Html, { HtmlProps } from '../components/Html';
import paths from '../../../config/paths';

const renderFullPage = () => (req: Request, res: Response) => {
  const routerContext: any = {};
  const helmetContext: any = {};

  const content = renderToString(
    <Provider store={res.locals.store}>
      <StaticRouter location={req.url} context={routerContext}>
        <I18nextProvider i18n={req.i18n}>
          <HelmetProvider context={helmetContext}>
            <App />
          </HelmetProvider>
        </I18nextProvider>
      </StaticRouter>
    </Provider>
  );

  // redux.js.org/recipes/server-rendering#security-considerations
  const state = serialize(res.locals.store.getState());

  // Initialize the i18n store and the language
  const resources: any = {};
  req.i18n.languages.forEach((l: string) => {
    resources[l] = req.i18n.services.resourceStore.data[l];
  });
  const initialLanguage = req.i18n.language;
  const initialI18nStore = serialize(resources);

  const htmlProps: HtmlProps = {
    children: content,
    css: [
      res.locals.assetPath('bundle.css'),
      res.locals.assetPath('vendor.css'),
    ],
    scripts: [
      res.locals.assetPath('bundle.js'),
      res.locals.assetPath('vendor.js'),
    ],
    helmetContext,
    state,
    initialI18nStore,
    initialLanguage,
  };

  if (process.env.PWA === 'false') {
    htmlProps.favicon =
      res.locals.assetPath(path.join(paths.publicAssets, 'favicon.png')) ||
      res.locals.assetPath(path.join(paths.publicAssets, 'favicon.ico')) ||
      res.locals.assetPath(path.join(paths.publicAssets, 'favicon.svg'));
  }

  if (
    process.env.PWA === 'true' &&
    process.env.METADATA_GENERATION === 'true'
  ) {
    htmlProps.metadata = res.locals.metadata || '';
  }

  return res
    .status(200)
    .send('<!doctype html>' + renderToString(<Html {...htmlProps} />));
};

export default renderFullPage;
