import webpack, { Configuration } from 'webpack';
import rimraf from 'rimraf';
import chalk from 'chalk';

import getConfig from '../config/webpack';
import paths from '../config/paths';
import { generateMetaData } from '../config/app';
import { logMessage, compilerPromise } from './utils';

// Ensure environment variables are read.
require('../config/env');

let webpackConfig: Configuration[];

const build = async () => {
  rimraf.sync(paths.clientBuild);
  rimraf.sync(paths.serverBuild);

  const [clientConfig, serverConfig] = webpackConfig;
  const multiCompiler = webpack([clientConfig, serverConfig]);

  const clientCompiler = multiCompiler.compilers.find(
    (compiler) => compiler.name === 'client'
  );
  const serverCompiler = multiCompiler.compilers.find(
    (compiler) => compiler.name === 'server'
  );

  const clientPromise = compilerPromise('client', clientCompiler);
  const serverPromise = compilerPromise('server', serverCompiler);

  serverCompiler.watch({}, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(serverConfig.stats));
      return;
    }
    console.error(chalk.red(stats.compilation.errors));
  });

  clientCompiler.watch({}, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(clientConfig.stats));
      return;
    }
    console.error(chalk.red(stats.compilation.errors));
  });

  // wait until client and server is compiled
  try {
    await serverPromise;
    await clientPromise;
    logMessage('Done!', 'info');
    process.exit();
  } catch (error) {
    logMessage(error, 'error');
  }
};

if (process.env.PWA === 'true') {
  generateMetaData()
    .then(() => {
      logMessage('[PWA] Metadata generated successfully !', 'info');
      webpackConfig = getConfig(process.env.NODE_ENV || 'development');
      build();
    })
    .catch(() => {
      logMessage(
        'Something went wrong when generating the metadata for the application',
        'error'
      );
    });
} else {
  webpackConfig = getConfig(process.env.NODE_ENV || 'development');
  build();
}
