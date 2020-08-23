import path from 'path';
import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import bodyParser from 'body-parser';
import manifestHelpers from 'express-manifest-helpers';
import i18nextMiddleware from 'i18next-http-middleware';

import paths from '../../config/paths';
import i18n from '../shared/lib/i18n';
import addStore from './middlewares/addStore';
import handleErrors from './middlewares/handleErrors';
import renderFullPage from './middlewares/renderFullPage';
import { i18nextXhr } from './middlewares/i18n';

require('dotenv').config();

const app = express();

app.use(
  paths.publicPath,
  express.static(path.join(paths.clientBuild, paths.publicPath))
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  manifestHelpers({
    manifestPath: path.join(
      paths.clientBuild,
      paths.publicPath,
      '/manifest.json'
    ),
  })
);

app.use(i18nextMiddleware.handle(i18n));
app.get('/locales/:locale/:ns.json', i18nextXhr);

app.use(addStore);
app.use(renderFullPage());
app.use(handleErrors);

app.listen(process.env.PORT || 8500, () => {
  console.log(
    `[${new Date().toISOString()}]`,
    chalk.blue(`App is running: http://localhost:${process.env.PORT || 8500}`)
  );
});

export default app;
