module.exports = (api) => {
  // Cache based on the value of NODE_ENV. Any time the using callback returns a value other than
  // the one that was expected, the overall config function will be called again and a new entry will
  // be added to the cache.
  api.cache.using(() => process.env.NODE_ENV);

  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-property-in-object',
      '@babel/plugin-proposal-private-methods',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-modules-commonjs',
    ],
  };
};
