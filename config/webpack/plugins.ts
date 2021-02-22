import path from 'path';
import webpack from 'webpack';
import serialize from 'serialize-javascript';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { TypedCssModulesPlugin } from 'typed-css-modules-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import PWAPlugin from '@mxjoly/pwa-webpack-plugin';

import envBuilder from '../env';
import paths from '../paths';
import getAppConfig from '../app';
import i18nConfig from '../../src/shared/lib/i18n/config';

const env = envBuilder();
const appConfig = getAppConfig();

const isProfilerEnabled = () => process.argv.includes('--profile');
const isDev = () => process.env.NODE_ENV === 'development';
const isPWA = () => (process.env.PWA === 'true' ? true : false);

const generateIcons = () =>
  process.env.ICONS_GENERATION === 'true' ? true : false;
const generateMetadata = () =>
  process.env.METADATA_GENERATION === 'true' ? true : false;

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
  // Simplifies creation of HTML files to serve the webpack bundles
  new HtmlWebpackPlugin({
    publicPath: paths.publicPath,
    template: paths.appTemplate,
    filename: path.join(paths.clientBuild, 'index.html'),
    inject: false,
    minify: !isDev(),
    favicon: isPWA() || !generateMetadata() ? null : paths.favicon,
    meta: generateMetadata()
      ? Object.assign(
          {
            charset: { charset: 'utf-8' },
            viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
            // referrer: 'origin',
            // copyright: '© 2020 - 2020 Application, ALL RIGHTS RESERVED',
            google: 'notranslate',
            'x-ua-compatible': 'IE=edge',
          },
          isPWA()
            ? {
                description: appConfig.description,
                'mobile-web-app-capable': 'yes',
                'apple-mobile-web-app-capable': 'yes',
                'apple-mobile-web-app-status-bar-style': 'white',
                'apple-mobile-web-app-title':
                  appConfig.short_name || appConfig.name,
                'application-name': appConfig.short_name || appConfig.name,
                'theme-color': appConfig.theme_color,
              }
            : {
                'theme-color': '#ffffff',
              }
        )
      : {},
    templateParameters: {
      state: serialize({}),
      initialI18nStore: serialize(i18nConfig.resources),
      initialLanguage:
        i18nConfig.load !== 'languageOnly'
          ? `navigator.languages ? navigator.languages[0] :
      (navigator.language || navigator.userLanguage || '${i18nConfig.fallbackLng}')`
          : `navigator.languages ? navigator.languages[0].slice(0, 2) :
          (navigator.language.slice(0, 2) || navigator.userLanguage.slice(0, 2) || '${i18nConfig.fallbackLng}')`,
      appName: isPWA() ? appConfig.name : '',
    },
  }),
  // Webpack plugin for generating an assets manifest.
  new WebpackAssetsManifest({
    output: 'assets-manifest.json',
    publicPath: paths.publicPath,
  }),
  // Generate the manifest files and the icons
  isPWA() &&
    new PWAPlugin({
      publicPath: paths.publicPath,
      emitMetadata: generateMetadata(),
      manifest: {
        options: appConfig,
      },
      icons: {
        favicon: paths.favicon,
        outputPath: path.join(paths.publicAssets, 'icons'),
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
  isPWA() &&
    new WorkboxPlugin.GenerateSW({
      swDest: 'service-worker.js',
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 10000000,
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
