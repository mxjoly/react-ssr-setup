import path from 'path';
import webpack from 'webpack';
import AssetsManifestPlugin from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { TypedCssModulesPlugin } from 'typed-css-modules-webpack-plugin';
import PWAPlugin from './plugins/PWAPlugin';

import envBuilder from '../env';
import paths from '../paths';
import getAppConfig from '../app';

const env = envBuilder();
const isProfilerEnabled = () => process.argv.includes('--profile');
const isDev = () => process.env.NODE_ENV === 'development';
const isPWA = () => (process.env.PWA === 'true' ? true : false);
const generateIcons = () =>
  process.env.OMIT_ICONS_GENERATION === 'true' ? false : true;
const appConfig = getAppConfig();

const shared = [
  // This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS.
  // It supports On-Demand-Loading of CSS and SourceMaps.
  new MiniCssExtractPlugin({
    filename: isDev() ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: isDev() ? '[id].css' : '[id].[contenthash].css',
  }),
  // This Webpack plugin enforces the entire path of all required modules match the exact case
  // of the actual path on disk. Using this plugin helps alleviate cases where developers working on OSX,
  // which does not follow strict path case sensitivity, will cause conflicts with other developers or build
  // boxes running other operating systems which require correctly cased paths.
  new CaseSensitivePathsPlugin(),
  // Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running, without a full reload
  isDev() && new webpack.HotModuleReplacementPlugin(),
].filter(Boolean);

const client = [
  // new webpack.ProgressPlugin(), // make this optional e.g. via `--progress` flag
  new webpack.DefinePlugin(env.stringified),
  new webpack.DefinePlugin({
    __SERVER__: 'false',
    __BROWSER__: 'true',
  }),
  // Webpack plugin for generating an assets manifest.
  new AssetsManifestPlugin({
    fileName: 'assets-manifest.json',
    publicPath: paths.publicPath,
  }),
  // Generate the manifest files and the icons
  isPWA() &&
    new PWAPlugin({
      publicPath: paths.publicPath,
      manifest: {
        options: appConfig,
      },
      icons: {
        favicon: paths.favicon,
        outputPath: 'assets/icons',
        backgroundColor: appConfig.background_color,
        themeColor: appConfig.theme_color,
        use: {
          favicons: generateIcons(),
          android: generateIcons(),
          apple: generateIcons(),
          appleStartup: generateIcons(),
          windows: generateIcons(),
          safari: generateIcons(),
          coast: generateIcons(),
        },
      },
    }),
  // Copy the favicon to assets
  !isPWA() &&
    new CopyPlugin({
      patterns: [
        {
          from: paths.favicon,
          to: path.join(
            paths.clientBuild,
            paths.publicPath,
            paths.publicAssets
          ),
        },
      ],
    }),
  // The plugin generates .css.d.ts file co-located with the corresponding .css file before compilation
  // phase so all CSS imports in TypeScript source code type check.
  new TypedCssModulesPlugin({
    globPattern: 'src/**/*.css',
  }),
  // Generate Chrome profile file which includes timings of plugins execution.
  isProfilerEnabled() && new webpack.debug.ProfilingPlugin(),
  isDev() &&
    new ReactRefreshWebpackPlugin({
      // Modifies how the error overlay integration works in the plugin.
      overlay: true,
    }),
].filter(Boolean);

const server = [
  new webpack.DefinePlugin({
    __SERVER__: 'true',
    __BROWSER__: 'false',
  }),
  new CopyPlugin({
    patterns: [
      {
        from: paths.locales,
        to: path.join(paths.serverBuild, 'locales'),
        globOptions: {
          ignore: ['*.missing.json'],
        },
      },
    ],
  }),
].filter(Boolean);

export default {
  shared,
  client,
  server,
};
