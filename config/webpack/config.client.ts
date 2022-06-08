import path from 'path';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import paths from '../paths';
import resolvers from './resolvers';
import plugins from './plugins';
import { client as clientLoaders } from './loaders';

const isDev = process.env.NODE_ENV === 'development';
const generateSourceMap = process.env.SOURCEMAP === 'true' ? true : false;

const config: Configuration = {
  name: 'client',
  target: 'web',
  mode: isDev ? 'development' : 'production',
  entry: {
    bundle: [
      paths.srcClient,
      // https://babeljs.io/docs/en/babel-polyfill
      require.resolve('core-js/stable'),
      require.resolve('regenerator-runtime/runtime'),
    ],
  },
  output: {
    path: path.join(paths.clientBuild, paths.publicPath),
    filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    publicPath: paths.publicPath,
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: clientLoaders,
  },
  resolve: resolvers,
  devtool: generateSourceMap
    ? isDev
      ? 'eval-cheap-module-source-map'
      : 'source-map'
    : false,
  plugins: [...plugins.shared, ...plugins.client] as any,
  performance: {
    hints: isDev ? false : 'warning',
  },
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: false,
    timings: false,
    version: false,
  },
};

if (!isDev) {
  config.optimization = {
    minimize: true,
    minimizer: [
      // TerserPlugin config is taken entirely from react-scripts
      // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 2018,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          keep_classnames: true,
          keep_fnames: true,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    moduleIds: 'named',
    emitOnErrors: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          test: /[/\\]node_modules[/\\]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  };
}

export default config;
