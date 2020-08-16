import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';

const isDev = process.env.NODE_ENV === 'development';
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;

const cssModuleOptions = isDev
  ? { getLocalIdent, exportLocalsConvention: 'camelCase' }
  : { localIdentName: '[hash:base64:8]', exportLocalsConvention: 'camelCase' };

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.s[ac]ss$/;
const imageRegex = /\.(jpe?g|png|gif|svg)$/i;

const babelLoader = {
  test: /\.(js|jsx|ts|tsx)$/i,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
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
    'css-hot-loader',
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: cssModuleOptions,
        importLoaders: 1,
        sourceMap: generateSourceMap,
      },
    },
    {
      loader: 'postcss-loader',
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
    'css-hot-loader',
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
      },
    },
    {
      loader: 'css-loader',
      options: { importLoaders: 1 },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: generateSourceMap,
      },
    },
  ],
};

const sassLoaderClient = {
  test: sassRegex,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
      },
    },
    {
      loader: 'css-loader',
      options: { importLoaders: 1 },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: generateSourceMap,
      },
    },
    'sass-loader',
  ],
};

const imageLoaderClient = {
  test: imageRegex,
  loader: 'url-loader',
  options: {
    name: isDev ? 'assets/[name].[ext]' : 'assets/[name].[hash:8].[ext]',
    limit: 2048, // the maximum size of a file in bytes
  },
};

const fileLoaderClient = {
  exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
  use: [
    {
      loader: 'file-loader',
      options: {
        name: isDev ? 'assets/[name].[ext]' : 'assets/[name].[hash:8].[ext]',
      },
    },
  ],
};

const cssModuleLoaderServer = {
  test: cssModuleRegex,
  use: [
    'css-hot-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: { ...cssModuleOptions, exportOnlyLocals: true },
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: generateSourceMap,
      },
    },
  ],
};

const cssLoaderServer = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: [MiniCssExtractPlugin.loader, 'css-loader'],
};

const sassLoaderServer = {
  test: sassRegex,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',
    'sass-loader',
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
  exclude: [/\.(js|tsx|ts|tsx|css|mjs|html|ejs|json)$/],
  use: [
    {
      loader: 'file-loader',
      options: {
        name: isDev ? 'assets/[name].[ext]' : 'assets/[name].[hash:8].[ext]',
        emitFile: false,
      },
    },
  ],
};

export const client = [
  {
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