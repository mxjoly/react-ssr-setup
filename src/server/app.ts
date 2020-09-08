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

const app = express.Router();

app.use(
  manifestHelpers({
    manifestPath: path.join(
      paths.clientBuild,
      paths.publicPath,
      '/manifest.json'
    ),
    cache: process.env.NODE_ENV === 'production',
  })
);

app.use(i18nextMiddleware.handle(i18n));
app.get('/locales/:locale/:ns.json', i18nextXhr);

app.use(addStore);
app.use(renderFullPage());
app.use(handleErrors);

export default app;
