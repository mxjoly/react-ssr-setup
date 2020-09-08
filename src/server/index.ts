import path from 'path';
import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import bodyParser from 'body-parser';

import paths from '../../config/paths';
import app from './app';

require('dotenv').config();

const server = express();

server.use(
  paths.publicPath,
  express.static(path.join(paths.clientBuild, paths.publicPath))
);

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('*', app);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.PORT || 8500, () => {
    console.log(
      `[${new Date().toISOString()}]`,
      chalk.blue(`App is running: http://localhost:${process.env.PORT || 8500}`)
    );
  });
}

export default server;
