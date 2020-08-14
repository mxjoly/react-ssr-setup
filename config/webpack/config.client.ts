import path from 'path';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import paths from '../paths';
import resolvers from './resolvers';
import plugins from './plugins';
import { client as clientLoaders } from './loaders';

const isDev = process.env.NODE_ENV === 'development';
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;

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
    filename: isDev ? '[name].js' : '[name].[hash:8].js',
    publicPath: paths.publicPath,
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: clientLoaders,
  },
  resolve: resolvers,
  devtool: generateSourceMap
    ? isDev
      ? '#cheap-module-eval-source-map'
      : '#source-map'
    : false,
  plugins: [...plugins.shared, ...plugins.client],
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
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
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
        sourceMap: generateSourceMap,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    namedModules: true,
    noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  };
}

export default config;
