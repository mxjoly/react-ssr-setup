import path from 'path';
import express from 'express';
import chalk from 'chalk';
import manifestHelpers from 'express-manifest-helpers';
import cors from 'cors';
import bodyParser from 'body-parser';

import paths from '../../config/paths';
import addStore from './middlewares/addStore';
import handleErrors from './middlewares/handleErrors';
import renderFullPage from './middlewares/renderFullPage';

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
