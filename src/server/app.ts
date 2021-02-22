import path from 'path';
import express from 'express';
import i18nextMiddleware from 'i18next-http-middleware';

import paths from '../../config/paths';
import i18n from '../shared/lib/i18n';

import addStore from './middlewares/addStore';
import handleErrors from './middlewares/handleErrors';
import renderFullPage from './middlewares/renderFullPage';
import manifestHelpers from './middlewares/manifestHelpers';
import i18nextXhr from './middlewares/i18nXhr';
import generateMetadata from './middlewares/generateMetadata';

const app = express.Router();

app.use(
  manifestHelpers({
    manifestPath: path.join(
      paths.clientBuild,
      paths.publicPath,
      'assets-manifest.json'
    ),
    cache: true,
  })
);

app.use(i18nextMiddleware.handle(i18n));
app.get('/locales/:locale/:ns.json', i18nextXhr);

if (process.env.PWA === 'true' && process.env.METADATA_GENERATION === 'true') {
  const getConfig = require('../../config/app').default;
  const { getConfigurationFile } = require('@mxjoly/pwa-webpack-plugin');
  const config = getConfig();
  app.use(
    generateMetadata({
      appName: config.name,
      cache: true,
      icons: getConfigurationFile(),
      themeColor: config.theme_color,
      backgroundColor: config.background_color,
      appleStatusBarStyle: 'default',
    })
  );
}

app.use(addStore);
app.use(renderFullPage());
app.use(handleErrors);

export default app;
