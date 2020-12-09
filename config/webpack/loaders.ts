import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import paths from '../paths';
import chalk from 'chalk';

const isDev = process.env.NODE_ENV === 'development';
const generateSourceMap = process.env.SOURCEMAP === 'true' ? true : false;

const cssModuleOptions = isDev
  ? { getLocalIdent, exportLocalsConvention: 'camelCase' }
  : {
      localIdentName: '[contenthash:base64:8]',
      exportLocalsConvention: 'camelCase',
    };

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.s[ac]ss$/;
const imageRegex = /\.(jpe?g|png|gif|svg)$/i;

const babelLoader = {
  test: /\.(js|jsx|ts|tsx)$/i,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      plugins: [
        // Allow parsing of import() (lazy loading)
        '@babel/plugin-syntax-dynamic-import',
        // This plugin transforms static class properties as well as properties declared with the property initializer syntax
        '@babel/plugin-proposal-class-properties',
        // Compile object rest and spread to ES5
        '@babel/plugin-proposal-object-rest-spread',
        // To use optional chaining in typescript
        '@babel/plugin-proposal-optional-chaining',
        // This plugin transforms ES2015 modules to CommonJS
        '@babel/plugin-transform-modules-commonjs',
      ],
      cacheDirectory: !isDev,
      cacheCompression: !isDev,
    },
  },
};

const cssModuleLoaderClient = {
  test: cssModuleRegex,
  use: [
    require.resolve('css-hot-loader'),
    MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: {
        modules: cssModuleOptions,
        importLoaders: 1,
        sourceMap: generateSourceMap,
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: generateSourceMap,
      },
    },
  ],
};

const cssLoaderClient = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: [
    require.resolve('css-hot-loader'),
    MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: { importLoaders: 1 },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: generateSourceMap,
      },
    },
  ],
};

const sassLoaderClient = {
  test: sassRegex,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: { importLoaders: 1 },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: generateSourceMap,
      },
    },
    require.resolve('sass-loader'),
  ],
};

const imageLoaderClient = {
  test: imageRegex,
  loader: require.resolve('url-loader'),
  options: {
    name(resourcePath: string) {
      const relativePath = path.relative(paths.srcShared, resourcePath);
      const dir = path.dirname(relativePath);
      if (!dir.startsWith('assets')) {
        console.log(
          chalk.yellow(
            chalk.bold('WARNING') +
              ' You must only set your images in the folder named assets.'
          )
        );
        return path.join(
          'assets',
          isDev ? '[name].[ext]' : '[name].[contenthash:8].[ext]'
        );
      }
      return path.join(
        dir,
        isDev ? '[name].[ext]' : '[name].[contenthash:8].[ext]'
      );
    },
    limit: 2048, // the maximum size of a file in bytes
  },
};

const fileLoaderClient = {
  exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
  loader: require.resolve('file-loader'),
  options: {
    name(resourcePath: string) {
      const relativePath = path.relative(process.cwd(), resourcePath);
      const dir = path.dirname(relativePath);
      if (dir.startsWith('node_modules/')) {
        return path.join(
          'assets',
          isDev ? '[name].[ext]' : '[name].[contenthash:8].[ext]'
        );
      }
      return path.join(
        dir,
        isDev ? '[name].[ext]' : '[name].[contenthash:8].[ext]'
      );
    },
  },
};

const cssModuleLoaderServer = {
  test: cssModuleRegex,
  use: [
    require.resolve('css-hot-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        modules: { ...cssModuleOptions, exportOnlyLocals: true },
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: generateSourceMap,
      },
    },
  ],
};

const cssLoaderServer = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: ['css-loader'],
};

const sassLoaderServer = {
  test: sassRegex,
  use: [
    require.resolve('css-loader'),
    require.resolve('postcss-loader'),
    require.resolve('sass-loader'),
  ],
};

const imageLoaderServer = {
  ...imageLoaderClient,
  options: {
    ...imageLoaderClient.options,
    emitFile: false,
  },
};

const fileLoaderServer = {
  ...fileLoaderClient,
  options: {
    ...fileLoaderClient.options,
    emitFile: false,
  },
};

export const client = [
  {
    // "oneOf" will traverse all following loaders until one will
    // match the requirements. When no loader matches it will fall
    // back to the "file" loader at the end of the loader list.
    oneOf: [
      babelLoader,
      cssModuleLoaderClient,
      cssLoaderClient,
      sassLoaderClient,
      imageLoaderClient,
      fileLoaderClient,
    ],
  },
];

export const server = [
  {
    oneOf: [
      babelLoader,
      cssModuleLoaderServer,
      cssLoaderServer,
      sassLoaderServer,
      imageLoaderServer,
      fileLoaderServer,
    ],
  },
];

export default { client, server };
