import webpack from 'webpack';
import rimraf from 'rimraf';
import chalk from 'chalk';

// Ensure environment variables are read.
import '../config/env';

import getConfig from '../config/webpack';
import paths from '../config/paths';
import { logMessage, compilerPromise } from './utils';

const webpackConfig = getConfig(process.env.NODE_ENV || 'development');

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

build();
