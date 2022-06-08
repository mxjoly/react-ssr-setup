import path from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';

import paths from '../paths';
import resolvers from './resolvers';
import plugins from './plugins';
import { server as serverLoaders } from './loaders';

const isDev = process.env.NODE_ENV === 'development';

const config: Configuration = {
  name: 'server',
  target: 'node',
  mode: isDev ? 'development' : 'production',
  entry: {
    server: [
      path.resolve(paths.srcServer),
      // // https://babeljs.io/docs/en/babel-polyfill
      require.resolve('core-js/stable'),
      require.resolve('regenerator-runtime/runtime'),
    ],
  },
  output: {
    path: paths.serverBuild,
    filename: 'server.js',
    publicPath: paths.publicPath,
  },
  externals: [nodeExternals()] as any,
  resolve: resolvers,
  module: {
    rules: serverLoaders,
  },
  plugins: [...plugins.shared, ...plugins.server] as any,
  performance: {
    hints: isDev ? false : 'warning',
  },
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    performance: false,
    reasons: false,
    timings: true,
    version: false,
  },
  node: {
    __dirname: false,
  },
};

export default config;
