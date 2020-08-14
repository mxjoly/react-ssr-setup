import path from 'path';
import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import envBuilder from '../env';
import paths from '../paths';

const env = envBuilder();
const isProfilerEnabled = () => process.argv.includes('--profile');
const isDev = () => process.env.NODE_ENV === 'development';

const shared = [
  new MiniCssExtractPlugin({
    filename: isDev() ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: isDev() ? '[id].css' : '[id].[contenthash].css',
  }),
  new CaseSensitivePathsPlugin(),
  isDev() && new webpack.HotModuleReplacementPlugin(),
].filter(Boolean);

const client = [
  new HtmlWebpackPlugin({
    filename: path.join(paths.clientBuild, 'index.html'),
    inject: true,
    template: paths.appHtml,
  }),
  // new webpack.ProgressPlugin(), // make this optional e.g. via `--progress` flag
  new webpack.DefinePlugin(env.stringified),
  new webpack.DefinePlugin({
    __SERVER__: 'false',
    __BROWSER__: 'true',
  }),
  new ManifestPlugin({
    fileName: 'manifest.json',
  }),
  isProfilerEnabled() && new webpack.debug.ProfilingPlugin(),
  isDev() &&
    new ReactRefreshWebpackPlugin({
      overlay: true,
    }),
].filter(Boolean);

const server = [
  new webpack.DefinePlugin({
    __SERVER__: 'true',
    __BROWSER__: 'false',
  }),
].filter(Boolean);

export default {
  shared,
  client,
  server,
};
